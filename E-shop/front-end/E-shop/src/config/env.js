const PROD_API = 'https://e-shop-back-end-vpfq.onrender.com/api'

const envApi = (import.meta.env.VITE_URL_BASE || '').trim()

const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(envApi)

// Only the dev server may talk to localhost: a visitor's browser has no API
// running on their own machine, so any built bundle pointing there gets every
// request refused. DEV is true only for `vite`, never for `vite build`, so this
// holds no matter which mode the bundle was built with.
const isDevServer = Boolean(import.meta.env.DEV)

const apiUrlBase =
  isDevServer && envApi ? envApi : isLocalApi || !envApi ? PROD_API : envApi

export {
apiUrlBase
}
