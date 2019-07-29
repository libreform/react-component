export default {
  WordPress: null,
  ajaxURL: '/wp-admin/admin-ajax.php?action=wplf_submit',
  ajaxCredentials: 'same-origin',
  headers: {},
  scriptLocation: '/wp-content/plugins/wp-libre-form/dist/wplf-frontend.js',
  onSubmitFailure: (error) => { throw error },
  settings: {
    autoinit: true,
  },
  i18n: {
    scriptTimeout: 'WP Libre Form script load timeout',
    failedToLoadForm: 'Unable to load form',
    formNotFound: 'Form not found',
    notConfigured: 'You have to configure() LibreForm before mounting',
    WPURLNull: 'WordPress URL must be set',
    unknown: 'Unknown error occurred',
    loading: 'Loading...',
    invalidFormProp: 'Invalid form type'
  }
}
