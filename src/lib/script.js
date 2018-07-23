import STATUS from './status'
import { errors } from './errors'

const script = {
  status: STATUS.NOT_REQUESTED,
  /*
   * Load WPLF client side bundle. Also includes fetch polyfill if necessary,
   * so fetch can be used for the form fetching also. Only necessary to do once.
   */
  load: () => {
    script.status = STATUS.LOADING
    const { scriptLocation } = window.ajax_object

    return new Promise((resolve, reject) => {
      const tag = document.createElement('script')
      const timeout = setTimeout(() => reject(errors.scriptTimeout()), 30000)
      tag.src = scriptLocation
      tag.onload = (e) => {
        clearInterval(timeout)
        script.status = STATUS.DONE
        resolve()
      }

      document.body.appendChild(tag)
    })
  },
}

export default script
