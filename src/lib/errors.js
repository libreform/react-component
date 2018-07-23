import defaults from './defaults'

const { i18n } = defaults

export const messages = {
  _messages: {
    scriptTimeout: i18n.scriptTimeout,
    failedToLoadForm: i18n.errorFailedToLoadForm,
    formNotFound: i18n.errorFormNotFound,
    notConfigured: i18n.errorNotConfigured,
    WPURLNull: i18n.errorWPURLNull,
    unknown: i18n.errorUnknown,
  },

  isKnown: (msg) => Object.keys(Object.entries(messages._messages).reduce((a, [k, v]) => ({
    ...a,
    [v]: k
  }), {})).indexOf(msg) > -1,

  translate: (i18n) => {
    console.log('translating with', i18n)
    Object.entries(i18n).forEach(([key, string]) => {
      messages._messages[key] = string
    })
    errors = generateErrors()
    console.log('translated', messages._messages)
  }
}

const generateErrors = () => Object.entries(messages._messages).reduce((acc, [key, msg]) => {
  acc[key] = () => new Error(msg)

  return acc
}, {})

export let errors = generateErrors()
