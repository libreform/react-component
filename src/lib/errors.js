export const messages = {
  _messages: {
    scriptTimeout: 'WP Libre Form script load timeout',
    failedToLoadForm: 'Unable to load form',
    unknown: 'Unknown error occurred',
  },

  isKnown: (msg) => Object.keys(Object.entries(messages._messages).reduce((a, [k, v]) => ({
    ...a,
    [v]: k
  }), {})).indexOf(msg) > -1,
}

export const errors = Object.entries(messages._messages).reduce((acc, [key, msg]) => {
  acc[key] = () => new Error(msg)

  return acc
}, {})
