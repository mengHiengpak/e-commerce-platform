import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

const Adminlayout = lazy(() => import("./layout/Adminlayout"))
const Home = lazy(() => import("./page/Home"))
const Product = lazy(() => import("./page/Product"))
const ProductDetail = lazy(() => import("./components/template/ProductDetail"))
const Account = lazy(() => import("./page/Account"))
const MyOrder = lazy(() => import("./components/template/MyOrder"))
const Wallets = lazy(() => import("./components/theme/Wallets"))
const Address = lazy(() => import("./components/template/Address"))
const AccountDetail = lazy(() => import("./components/template/AccountDetail"))
const Contact = lazy(() => import("./page/Contact"))
const Signin = lazy(() => import("./components/auth/Signin"))
const Signup = lazy(() => import("./components/auth/Signup"))
const ForgetPS = lazy(() => import("./components/auth/ForgetPS"))
const AuthRedirect = lazy(() => import("./components/AuthRedirect"))
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"))
const BuyMethod = lazy(() => import("./components/BuyMethod.jsx"))
const WelletMethod = lazy(() => import("./components/WelletMethod.jsx"))
const ProductStorePayment = lazy(() => import("./components/assets/ProductStorePayment.jsx"))
import { lazy, Suspense } from "react"
const Loading = lazy(() => import("./components/Loading.jsx"))


function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Suspense fallback={<Loading/>}>
              <Routes>
        <Route path="signin" element={<AuthRedirect><Signin/></AuthRedirect>}></Route>
        <Route path="signup" element={<AuthRedirect><Signup/></AuthRedirect>}></Route>
        <Route path="forgot" element={<AuthRedirect><ForgetPS/></AuthRedirect>}></Route>
        <Route path="/account/:id/method" element={<ProtectedRoute><BuyMethod /></ProtectedRoute>} />
        <Route path='/account/:id/methodProductStore' element={<ProtectedRoute><ProductStorePayment /></ProtectedRoute>} />
        <Route path="/account/wallets/account/walltes" element={<ProtectedRoute><WelletMethod/></ProtectedRoute>}></Route>
        <Route path="/" element={<ProtectedRoute><Adminlayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="products" element={<Product />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="account" element={<Account />}>
            <Route index element={<MyOrder />} />
            <Route path="orderplace" element={<MyOrder />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="address" element={<Address />} />
            <Route path="detail" element={<AccountDetail />} />
          </Route>
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
