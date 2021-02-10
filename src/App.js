import "antd/dist/antd.css";
// import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Faq from "./pages/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import MyProfile from "./pages/customer/MyProfile";
import Cart from "./pages/customer/Cart";
import Wishlist from "./pages/customer/Wishlist";
import Checkout from "./pages/customer/Checkout";
import OngoingOrders from "./pages/customer/OngoingOrders";
import PreviousOrders from "./pages/customer/PreviousOrders";
import Search from "./pages/Search";

import Topnav from "./components/nav/Topnav";
import Footer from "./components/nav/Footer";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import { getCartDetails } from "./functions/customer";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWishlist } from "./functions/customer";

function App() {
  const { customer } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  useEffect(() => {
    if (customer) {
      const loadCartItemss = () =>
        getCartDetails(customer.token)
          .then((res) => {
            if (res.data.success === "1") {
              dispatch({
                type: "GET_CART",
                payload: { ...customer, cartItems: res.data.cart_items },
              });
            } else
              dispatch({
                type: "GET_CART",
                payload: { ...customer, cartItems: undefined },
              });
          })
          .catch((err) => console.log(err));

      loadCartItemss();
    }
  }, []);

  useEffect(() => {
    if (customer) {
      getWishlist(customer.token).then((res) => {
        if (res.data.success === "1")
          dispatch({
            type: "GET_WISHLIST",
            payload: { ...customer, wishlist: res.data.fav_items },
          });
        else
          dispatch({
            type: "GET_WISHLIST",
            payload: { ...customer, wishlist: undefined },
          });
      });
    }
  }, []);
  return (
    <div className="App">
      <ToastContainer />
      <ScrollToTop />
      <header className="App-header">
        <Topnav />
      </header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/about" component={About} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />
        <Route exact path="/faq" component={Faq} />
        <Route exact path="/feedback" component={Feedback} />
        <Route exact path="/product-list/:slug" component={ProductList} />
        <Route exact path="/product-details/:slug" component={ProductDetails} />
        <Route exact path="/user/profile" component={MyProfile} />
        <Route exact path="/user/cart" component={Cart} />
        <Route exact path="/user/wishlist" component={Wishlist} />
        <Route exact path="/user/checkout" component={Checkout} />
        <Route exact path="/user/ongoing-orders" component={OngoingOrders} />
        <Route exact path="/user/previous-orders" component={PreviousOrders} />
        <Route exact path="/search/:keyword" component={Search} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
