import { BrowserRouter, Routes, Route } from "react-router"
import { Toaster } from "react-hot-toast"
import { lazy, Suspense, useEffect } from "react"

const Signin = lazy(() => import("./pages/auth/Signin"))
const Signup = lazy(() => import("./pages/auth/Signup"))
const Dashboard = lazy(() => import("./pages/categories/Dashboard"))
const AdminLayout = lazy(() => import("./pages/layout/AdminLayout"))
const Customer = lazy(() => import("./pages/custom/Customer"))
const CreateCustomer = lazy(() => import("./pages/custom/CreateCustomer"))
const EditCustomer = lazy(() => import("./pages/custom/editCustomer"))
const Supplier = lazy(() => import("./pages/supplier/Supplier"))
const CreateSupplier = lazy(() => import("./pages/supplier/CreateSupplier"))
const EditSupplier = lazy(() => import("./pages/supplier/EditSupplier"))
const Category = lazy(() => import("./pages/category/Category"))
const CreateCategory = lazy(() => import("./pages/category/CreateCategory"))
const EditCateogry = lazy(() => import("./pages/category/EditCAtegory"))
const Products = lazy(() => import("./pages/products/Products"))
const CreateProduct = lazy(() => import("./pages/products/CreateProduct"))
const EditProduct = lazy(() => import("./pages/products/EditProduct"))
const Protected = lazy(() => import("./pages/components/Protected"))
const AuthRedirect = lazy(() => import("./pages/components/AuthRedirect"))
const Purchase = lazy(() => import("./pages/purchase/Purchase"))
const CreatePurchase = lazy(() => import("./pages/purchase/CreatePurchase"))
const ListSale = lazy(() => import("./pages/sale/ListSale"))
const POSsale = lazy(() => import("./pages/sale/POSsale"))
const POS = lazy(() => import("./pages/sale/POS"))
const SalePayment = lazy(() => import("./pages/sale/SalePayment"))
const SalePaymentStatus = lazy(() => import("./pages/sale/SalePaymentStatus"))
const User = lazy(() => import("./pages/user/User"))
const CreateUser = lazy(() => import("./pages/user/CreateUser"))
const EditUser = lazy(() => import("./pages/user/EditUser"))
const SaleReport = lazy(() => import("./pages/Report/SaleReport"))
const StockReport = lazy(() => import("./pages/Report/StockReport"))
const CashierLayout = lazy(() => import("./pages/layout/CashierLayout"))
const POSforCashier = lazy(() => import("./pages/sale/POS/POSforCashier"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Unauthorization = lazy(() => import("./pages/Unauthorization"))
const Loading = lazy(() => import("./pages/Loading"))

function App() {
  useEffect(() => {
    document.title = import.meta.env.VITE_APP_NAME || "E-shop Dashboard"
}, [])

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/signin"
              element={
                <AuthRedirect>
                  <Signin />
                </AuthRedirect>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route
              element={
                <Protected allowedRole={["super", "admin", "cashier"]}>
                  <AdminLayout />
                </Protected>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="customer" element={<Customer />} />
              <Route path="createcustomer" element={<CreateCustomer />} />
              <Route path="editcustomer/:id" element={<EditCustomer />} />
              <Route path="supplier" element={<Supplier />} />
              <Route path="supplier/create" element={<CreateSupplier />} />
              <Route path="supplier/edit/:id" element={<EditSupplier />} />
              <Route path="category" element={<Category />} />
              <Route path="category/create" element={<CreateCategory />} />
              <Route path="category/edit/:id" element={<EditCateogry />} />
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="purchase/create" element={<CreatePurchase />} />
              <Route path="user" element={<User />} />
              <Route path="user/create" element={<CreateUser />} />
              <Route path="user/edit/:id" element={<EditUser />} />
              <Route path="sale/list" element={<ListSale />} />
              <Route path="sale/POS" element={<POS />} />
              <Route path="sale/payment" element={<SalePayment />} />
              <Route path="sale/payment/status/:id" element={<SalePaymentStatus />} />
              <Route path="sale/report" element={<SaleReport />} />
              <Route path="stock/report" element={<StockReport />} />
            </Route>

            <Route element={<CashierLayout />}>
              <Route path="/cashier/pos" element={<POSforCashier />} />
            </Route>

            <Route
              path="sale/list/sale/pos/:id"
              element={
                <Protected allowedRole={["super", "admin", "cashier"]}>
                  <POSsale />
                </Protected>
              }
            />

            <Route path="/unauthorization" element={<Unauthorization />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App