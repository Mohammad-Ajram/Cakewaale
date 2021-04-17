import "antd/dist/antd.css";
import "./index.css";

import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getCartDetails } from "./functions/customer";
import { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWishlist } from "./functions/customer";
import { LoadingOutlined } from "@ant-design/icons";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const GoogleSignupComplete = lazy(() => import("./pages/GoogleSignupComplete"));
const Faq = lazy(() => import("./pages/Faq"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const Feedback = lazy(() => import("./pages/Feedback"));
const ProductList = lazy(() => import("./pages/ProductList"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const MyProfile = lazy(() => import("./pages/customer/MyProfile"));
const Cart = lazy(() => import("./pages/customer/Cart"));
const Wishlist = lazy(() => import("./pages/customer/Wishlist"));
const Checkout = lazy(() => import("./pages/customer/Checkout"));
const OngoingOrders = lazy(() => import("./pages/customer/OngoingOrders"));
const PreviousOrders = lazy(() => import("./pages/customer/PreviousOrders"));
const Search = lazy(() => import("./pages/Search"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const Topnav = lazy(() => import("./components/nav/Topnav"));
const Footer = lazy(() => import("./components/nav/Footer"));
const Promocode = lazy(() => import("./pages/Promocode"));

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
      <Suspense
        fallback={
          <div className="loading-container">
            <div
              className="loader"
              style={{ fontSize: "48px", color: "#cb202d" }}
            >
              <LoadingOutlined />
            </div>
          </div>
        }
      >
        <ToastContainer />

        <ScrollToTop />
        <header className="App-header">
          <Topnav />
        </header>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route
            exact
            path="/signup/complete"
            component={GoogleSignupComplete}
          />
          <Route exact path="/about" component={About} />
          <Route exact path="/privacy-policy" component={PrivacyPolicy} />
          <Route exact path="/faq" component={Faq} />
          <Route exact path="/feedback" component={Feedback} />
          <Route exact path="/product-list/:slug" component={ProductList} />
          <Route
            exact
            path="/product-details/:slug"
            component={ProductDetails}
          />
          <Route exact path="/user/profile" component={MyProfile} />
          <Route exact path="/user/cart" component={Cart} />
          <Route exact path="/user/wishlist" component={Wishlist} />
          <Route exact path="/user/checkout" component={Checkout} />
          <Route exact path="/user/ongoing-orders" component={OngoingOrders} />
          <Route
            exact
            path="/user/previous-orders"
            component={PreviousOrders}
          />
          <Route exact path="/search/:keyword" component={Search} />
          <Route exact path="/promocode" component={Promocode} />
        </Switch>
        <Footer />
        <div className="space"></div>
      </Suspense>
    </div>
  );
}

export default App;
