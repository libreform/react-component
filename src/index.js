import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HTML from './lib/parser.js'
import STATUS from './lib/status.js'
import script from './lib/script.js'
import defaults from './lib/defaults.js'
import { messages, errors } from './lib/errors.js'

/*
 * Stores for possible callbacks. Must live outside of component state to allow
 * having multiple LibreForm instances displayed at once.
 */
const success = {}
const denied = {}

export const configure = (options = {}) => {
  const { i18n: defaultI18n, ...otherDefaults } = defaults
  const { i18n: overridingI18n, ...otherOptions } = options
  const {
    WordPress,
    ajaxCredentials,
    ajaxURL,
    scriptLocation,
    onSubmitFailure,
    headers,
    i18n,
    settings,
  } = {
    ...otherDefaults,
    ...(window.WPLF_DATA || {}), // Allow calling configure multiple times
    ...otherOptions,
    i18n: {
      ...defaultI18n,
      ...overridingI18n,
    },
  }

  messages.translate(i18n)

  if (WordPress === null) {
    throw errors.WPURLNull()
  }

  const conf = {
    ajax_url: ajaxURL.indexOf('http') === -1 ? WordPress + ajaxURL : ajaxURL,
    ajax_credentials: ajaxCredentials,
    wplf_assets_dir: `${WordPress}/wp-content/plugins/wp-libre-form/assets`,
    WordPress,
    request_headers: headers,
    scriptLocation:
      scriptLocation.indexOf('http') === -1
        ? WordPress + scriptLocation
        : scriptLocation,
    onSubmitFailure,
    i18n,
    settings,
  }

  window.WPLF_DATA = conf
}

export default class LibreForm extends Component {
  static propTypes = {
    // Lifecycles for WPLF
    beforeLoad: PropTypes.func, // Called before the form starts loading
    afterLoad: PropTypes.func, // Called after the form has loaded
    onSubmitSuccess: PropTypes.func, // Callback, called on successful submission
    onSubmitDenied: PropTypes.func, // Callback, called on declined submission

    replace: PropTypes.func, // Change how form will be rendered
    loading: PropTypes.func, // Displayed when form is loading
    error: PropTypes.func, // Displayed when form loading errored
    form: PropTypes.oneOfType([
      PropTypes.string, // Slug of the form you want to load
      PropTypes.number, // Or the ID
    ]),
    referrer: PropTypes.string, // Set the referrer field value
    formKey: PropTypes.string, // Use custom key
  }

  static defaultProps = {
    replace: (domNode) => {
      const { attribs, name: htmlEl } = domNode

      if (attribs) {
        if (htmlEl === 'input') {
          const {
            defaultvalue, // https://github.com/remarkablemark/html-react-parser/issues/63#issuecomment-407593055
            value,
            ...props
          } = attribs

          // We don't want to "remove" any attributes, which is why this is separate
          const { type, name } = props

          if (defaultvalue || value) {
            props.defaultValue = defaultvalue || value
          }

          if (type === 'hidden' && name === 'referrer') {
            props.defaultValue = window.location.href
          }

          return React.createElement(htmlEl, props)
        }
      }
    },
    loading: (props) => <p>{window.WPLF_DATA.i18n.loading}</p>,
    error: ({ message }) => <p>{message}</p>,
    referrer: window.location.href,
    onSubmitSuccess: (response) =>
      console.log('Form submission success', response),
    onSubmitDenied: (response) =>
      console.log('Form submission denied', response),
  }

  constructor(props) {
    super(props)

    this.state = {
      form: {
        status: STATUS.NOT_REQUESTED,
        data: null,
      },
    }
  }

  /*
   * Success and error callbacks delegate callbacks defined in props. This way
   * you can have different callbacks for every instance. The component instance is
   * passed into the callback.
   */
  successCallback = (response) => {
    const { slug } = response

    if (success[slug]) {
      success[slug](response, this)
    }
  }

  errorCallback = (errOrResponse) => {
    const { slug } = errOrResponse

    if (denied[slug]) {
      // response!
      denied[slug](errOrResponse, this)
    } else {
      // error
      window.WPLF_DATA.onSubmitFailure(errOrResponse)
    }
  }

  loadForm() {
    const { form } = this.props
    const { WordPress } = window.WPLF_DATA
    const formType = typeof form

    this.setState({ form: { ...this.state.form, status: STATUS.LOADING } })

    let reqURL = `${WordPress}/wp-json/wp/v2/wplf-form?per_page=1`

    if (formType === 'string') {
      // search with slug
      reqURL = reqURL + `&slug=${form}`
    } else if (formType === 'number') {
      // search with id
      reqURL = reqURL + `&include=${form}`
    } else {
      throw errors.invalidFormProp()
    }

    return new Promise((resolve, reject) => {
      fetch(reqURL, {
        credentials: WPLF_DATA.ajax_credentials || 'same-origin',
        headers: WPLF_DATA.request_headers || {},
      })
        .then((r) => {
          const { ok } = r

          if (!ok) {
            return reject(errors.failedToLoadForm())
          } else {
            return r.json()
          }
        })
        .then((results) => {
          if (!results || !results.length) {
            return reject(errors.formNotFound())
          }

          if (!this.mounted) {
            resolve()
            return
          }

          const post = results[0]

          this.setState(
            {
              form: {
                status: STATUS.DONE,
                data: post,
              },
            },
            resolve
          )
        })
        .catch(reject)
    })
  }

  setErrorState = (error) => {
    if (!this.mounted) {
      return
    }

    if (error) {
      const { message } = error

      // Known errors are shown with a different message.
      if (messages.isKnown(message)) {
        return this.setState({
          form: {
            status: STATUS.ERROR,
            data: error,
          },
        })
      }
    }

    // If it wasn't a known error (or `error` is undefined), set a generic error
    this.setState({
      form: {
        status: STATUS.ERROR,
        data: errors.unknown(),
      },
    })
  }

  isLoaded() {
    const { form } = this.state
    const conditions = [
      script.status === STATUS.DONE,
      form.status === STATUS.DONE,
    ]

    return conditions.every((cond) => cond === true)
  }

  onReady() {
    const {
      afterLoad,
      onSubmitSuccess,
      onSubmitDenied,
      form,
      referrer,
    } = this.props

    if (this.isLoaded()) {
      const formEl = this.container.querySelector('form')

      if (formEl) {
        const referrerInput = formEl.querySelector('[name="referrer"]')

        referrerInput &&
          (referrerInput.value = referrer || window.location.href)
        afterLoad && afterLoad(form, this.container)

        if (window.wplf) {
          if (onSubmitSuccess) {
            success[form] = onSubmitSuccess
            window.wplf.successCallbacks = [this.successCallback]
          }

          if (onSubmitDenied) {
            denied[form] = onSubmitDenied
            window.wplf.errorCallbacks = [this.errorCallback]
          }

          window.wplf.attach(formEl)
        } else {
          console.log(
            "WPLF is not loaded yet, which is... weird. You've encountered a bug."
          )
        }
      }
    }
  }

  componentDidMount() {
    this.mounted = true

    const { beforeLoad, form } = this.props
    const container = this.container

    if (!window.WPLF_DATA) {
      throw errors.notConfigured()
    }

    if (
      script.status === STATUS.NOT_REQUESTED ||
      script.status === STATUS.ERROR
    ) {
      script
        .load()
        .then(() => {
          beforeLoad && beforeLoad(form, container)
          return this.loadForm().then(() => {
            this.onReady()
          })
        })
        .catch(this.setErrorState)
    } else {
      beforeLoad && beforeLoad(form, container)
      this.loadForm()
        .then(() => {
          this.onReady()
        })
        .catch(this.setErrorState)
    }
  }

  componentDidUpdate() {
    this.onReady()
  }

  componentWillUnmount() {
    this.mounted = false

    const { form } = this.props

    if (success[form]) {
      delete success[form]
    }

    if (denied[form]) {
      delete denied[form]
    }
  }

  /*
   * You can make the form re-render by providing a different key. By default,
   * the form will re-render when referrer changes.
   */
  render() {
    const {
      form: formSlug,
      referrer,
      formKey,
      loading,
      error,
      replace,
    } = this.props
    const { form } = this.state

    const isLoaded = this.isLoaded()
    const isError = form.status === STATUS.ERROR

    console.log(this.props, this.state)

    /**
     * Hack. I've removed the rendered and protected properties in my api proxy, and
     * thus flattened the response. WPLF doesn't have custom REST API endpoints,
     * and use the same endpoints as WP core.
     */
    const getContent = (content) => {
      if (content.rendered) {
        return content.rendered
      }

      return content
    }

    return (
      <div
        className="react-component"
        ref={(n) => {
          this.container = n
        }}
        key={formKey || `${formSlug}-${referrer}`}
      >
        {isError ? (
          error(form.data)
        ) : isLoaded ? (
          <HTML options={{ replace }}>{getContent(form.data.content)}</HTML>
        ) : (
          loading(form)
        )}
      </div>
    )
  }
}
