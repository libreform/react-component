import defaults from './defaults'

const { i18n } = defaults

// Not exported for a reason
const errorMessages = {
  scriptTimeout: i18n.scriptTimeout,
  failedToLoadForm: i18n.errorFailedToLoadForm,
  formNotFound: i18n.errorFormNotFound,
  notConfigured: i18n.errorNotConfigured,
  WPURLNull: i18n.errorWPURLNull,
  unknown: i18n.errorUnknown,
  invalidFormProp: i18n.invalidFormProp,
}

const messages = {
  isKnown: (msg) => Object.keys(Object.entries(errorMessages).reduce((a, [k, v]) => ({
    ...a,
    [v]: k
  }), {})).indexOf(msg) > -1,

  translate: (i18n) => {
    Object.entries(i18n).forEach(([key, string]) => {
      errorMessages[key] = string
    })

    errors = messages.generateErrors()
  },
  generateErrors: () => Object.entries(errorMessages).reduce((acc, [key, msg]) => {
    acc[key] = () => new Error(msg)

    return acc
  }, {})
}
let errors = messages.generateErrors()

export {
  messages,
  errors,
}
