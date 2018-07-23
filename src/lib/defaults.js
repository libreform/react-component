export default {
  WordPress: null,
  ajaxCredentials: 'same-origin',
  scriptLocation: '/wp-content/plugins/wp-libre-form/assets/scripts/wplf-form.js',
  onSubmitFailure: (error) => { throw error },
  i18n: {
    scriptTimeout: 'WP Libre Form script load timeout',
    failedToLoadForm: 'Unable to load form',
    formNotFound: 'Form not found',
    notConfigured: 'You have to configure() LibreForm before mounting',
    WPURLNull: 'WordPress URL must be set',
    unknown: 'Unknown error occurred',
    loading: 'Loading...',
  }
}
