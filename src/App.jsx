
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { clearExpiredCookies, clearExpiredLocalStorage } from './utils/auth';
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import Logout from './views/auth/Logout'
import ForgotPassword from './views/auth/ForgotPassword'
import CreatePassword from './views/auth/CreatePassword'
import Products from './views/store/Products'
import ProductDetail from './views/store/ProductDetail'
import Cart from './views/store/Cart'
import Checkout from './views/store/Checkout'
import Search from './views/store/Search'

import StoreHeader from './views/base/StoreHeader'
import StoreFooter from './views/base/StoreFooter'
import MainWrapper from './layout/MainWrapper'
import PaymentSuccess from './views/store/PaymentSuccess'
import { CartProvider } from './views/plugin/Context';
import { CartContext } from './views/plugin/Context'
import { useEffect, useState } from 'react'
import CartID from './views/plugin/CartID'
import UserData from './views/plugin/UserData'
import apiInstance from './utils/axios'
import Account from './views/customer/Account'
import PrivateRoute from './layout/PrivateRoute'
import VendorPrivateRoute from './layout/VendorPrivateRoute'
import Orders from './views/customer/Orders'
import OrderDetail from './views/customer/OrderDetail'
import Wishlist from './views/customer/Wishlist'
import CustomerNotification from './views/customer/CustomerNotification'
import CustomerSetting from './views/customer/Settings'
import Invoice from './views/customer/Invoice'
import Dashboard from './views/vendor/Dashboard'
import Product from './views/vendor/Product'
import VendorOrders from './views/vendor/Orders'
import VendorOrderDetail from './views/vendor/OrderDetail'
import Earning from './views/vendor/Earning'
import Reviews from './views/vendor/Reviews'
import ReviewDetail from './views/vendor/ReviewDetail'
import Coupon from './views/vendor/Coupon'
import EditCoupon from './views/vendor/EditCoupon'
import Notification from './views/vendor/Notification'
import VendorSettings from './views/vendor/VendorSettings'
import Shop from './views/vendor/Shop'
import AddProduct from './views/vendor/AddProduct'
import UpdateProduct from './views/vendor/UpdateProduct'
import CategoryProduct from './views/store/CategoryProduct';
import ReturnPolicy from './footer/ReturnPolicy';
import Complaints from './footer/Complaints';
import HelpCenter from './footer/HelpCenter';
import Payment from './footer/Payment';
import Tracking from './views/vendor/Tracking';
import VendorRegister from './views/vendor/VendorRegister';


function App() {
  const [cartCount, setCartCount] = useState();
  const cart_id = CartID();
  const userData = UserData();

  useEffect(() => {
      clearExpiredCookies();
      clearExpiredLocalStorage();
      const url = userData ? `cart-list/${cart_id}/${userData?.user_id}` : `cart-list/${cart_id}/`;
      apiInstance.get(url).then((res) => {
          setCartCount(res.data.length);
      });
  }, []);

  return (
    <CartContext.Provider value={([cartCount, setCartCount])}>
      <BrowserRouter>
        <StoreHeader/>
          <MainWrapper>
          <Routes>
            <Route path='/login' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/logout' element={<Logout />}/>
            <Route path='/forgot-password' element={<ForgotPassword />}/>
            <Route path='/create-password' element={<CreatePassword />}/>
            <Route path='/create-new-password' element={<CreatePassword />} /> 

            {/* Store Components */}
            <Route path='/' element= {<Products />}/>
            <Route path='/detail/:slug/' element= {<ProductDetail />}/>
            <Route path='/cart/' element= {<Cart />}/>
            <Route path='/checkout/:order_oid/' element= {<Checkout />}/>
            <Route path='/payment-success/:order_oid/' element= {<PaymentSuccess />}/>
            <Route path='/search/' element= {<Search />}/>
            <Route path='/products/category/:slug/' element={<CategoryProduct />} />

            {/* Customer Routes */}
            <Route path='/customer/account/' element= {<PrivateRoute><Account /></PrivateRoute>}/>
            <Route path='/customer/orders/' element= {<PrivateRoute><Orders /></PrivateRoute>}/>
            <Route path='/customer/orders/:order_oid/' element= {<PrivateRoute><OrderDetail /></PrivateRoute>}/>
            <Route path='/customer/wishlist/' element= {<PrivateRoute><Wishlist /></PrivateRoute>}/>
            <Route path='/customer/notifications/' element= {<PrivateRoute><CustomerNotification /></PrivateRoute>}/>
            <Route path='/customer/settings/' element= {<PrivateRoute><CustomerSetting /></PrivateRoute>}/>
            <Route path='/customer/invoice/:order_oid/' element= {<PrivateRoute><Invoice /></PrivateRoute>}/>

            {/* Vendor Routes */}
            <Route path='/vendor/register/' element= {<PrivateRoute>< VendorRegister/></PrivateRoute>}/>
            <Route path='/vendor/dashboard/' element={<VendorPrivateRoute><Dashboard /></VendorPrivateRoute>} />
            <Route path='/vendor/products/' element={<VendorPrivateRoute><Product /></VendorPrivateRoute>} />
            <Route path='/vendor/orders/' element={<VendorPrivateRoute><VendorOrders /></VendorPrivateRoute>} />
            <Route path='/vendor/orders/:order_oid/' element={<VendorPrivateRoute><VendorOrderDetail /></VendorPrivateRoute>} />
            <Route path="/vendor/orders/:order_oid/item/:order_item_id/tracking/" element={<VendorPrivateRoute><Tracking /></VendorPrivateRoute>} />
            <Route path='/vendor/earning/' element={<VendorPrivateRoute><Earning /></VendorPrivateRoute>} />
            <Route path='/vendor/reviews/' element={<VendorPrivateRoute><Reviews /></VendorPrivateRoute>} />
            <Route path='/vendor/reviews/:review_id/' element={<VendorPrivateRoute><ReviewDetail /></VendorPrivateRoute>} />
            <Route path='/vendor/coupon/' element={<VendorPrivateRoute><Coupon /></VendorPrivateRoute>} />
            <Route path='/vendor/coupon/:coupon_id/' element={<VendorPrivateRoute><EditCoupon /></VendorPrivateRoute>} />
            <Route path='/vendor/notifications/' element={<VendorPrivateRoute><Notification /></VendorPrivateRoute>} />
            <Route path='/vendor/settings/' element={<VendorPrivateRoute><VendorSettings /></VendorPrivateRoute>} />
            <Route path='/vendor/:slug/' element={<VendorPrivateRoute><Shop /></VendorPrivateRoute>} />
            <Route path='/vendor/product/new/' element={<VendorPrivateRoute><AddProduct /></VendorPrivateRoute>} />
            <Route path='/vendor/product/update/:pid/' element={<VendorPrivateRoute><UpdateProduct /></VendorPrivateRoute>} />

            {/* footer */}
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/payment" element={<Payment />} />

          </Routes>

          </MainWrapper>
          
        <StoreFooter/>
      </BrowserRouter>
    </CartContext.Provider>
  )
}

export default App
