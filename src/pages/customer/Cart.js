import { useState, useEffect } from "react";
import CartProductCard from "../../components/cards/CartProductCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCartDetails } from "../../functions/customer";
import EmptyCart from "../../images/empty_cart.png";
import { getFlavours } from "../../functions/index";
import { useDispatch } from "react-redux";

const Cart = ({ history }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [flavours, setFlavours] = useState([]);

  const { customer } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();
  useEffect(() => {
    if (!(customer && customer.token)) {
      toast.error("Log in to view your cart");

      history.push("/login");
    }
  }, [customer, history]);

  useEffect(() => {
    getFlavours().then((res) => setFlavours(res.data.All_Flavours));
  }, []);

  const loadCartItems = () =>
    getCartDetails(customer.token)
      .then((res) => {
        if (res.data.success === "1") setCartItems(res.data.cart_items);
        else setCartItems([]);
      })
      .catch((err) => console.log(err));

  useEffect(() => {
    const loadCartItemss = () =>
      getCartDetails(customer.token)
        .then((res) => {
          if (res.data.success === "1") {
            let cTotal = 0;
            let sTotal = 0;
            for (let i = 0; i < res.data.cart_items.length; i++) {
              cTotal += res.data.cart_items[i].total_price;
              const discount = Math.round(
                (res.data.cart_items[i].discounted_price /
                  res.data.cart_items[i].price) *
                  100
              );

              sTotal += res.data.cart_items[i].total_price * (100 / discount);
            }
            if (cartTotal === 0) setCartTotal(cTotal);
            if (subTotal === 0) setSubTotal(sTotal);
            if (cartItems.length === 0) setCartItems(res.data.cart_items);
            dispatch({
              type: "GET_CART",
              payload: { ...customer, cartItems: res.data.cart_items },
            });
          } else setCartItems([]);
        })
        .catch((err) => console.log(err));

    loadCartItemss();
  }, []);

  const handleCheckout = () => {
    dispatch({
      type: "GET_CART",
      payload: { ...customer, cartItems },
    });
    history.push({
      pathname: "/user/checkout",
      state: { from: "user/cart" },
    });
  };

  return (
    <>
      <h2 className="section-title">My Cart ({cartItems.length} items)</h2>
      {!customer.cartItems && (
        <div
          className="container-fluid"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 50px 0 50px",
          }}
        >
          <img src={EmptyCart} style={{ width: "50%" }} alt="empty cart" />
          <h4 className="text-center">Oops! Your Cart is empty</h4>
        </div>
      )}
      {customer.cartItems && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-8 ">
              {cartItems.length > 0 &&
                cartItems.map((item, i) => (
                  <CartProductCard
                    key={i}
                    index={i}
                    product={item}
                    loadCartItems={loadCartItems}
                    flavours={flavours}
                    setSubTotal={setSubTotal}
                    setCartTotal={setCartTotal}
                    cartTotal={cartTotal}
                    subTotal={subTotal}
                    cartItems={cartItems}
                  />
                ))}
            </div>

            <div className="col-md-4">
              <h4>Price Details</h4>
              <h6>
                Total Items : <b>{cartItems.length}</b>
              </h6>
              <h6>
                Sub Total : <b>₹{Math.round(subTotal)}</b>
              </h6>
              <h6>
                Discount : <b>₹{Math.round(subTotal - cartTotal)}</b>
              </h6>
              <hr />
              <h6>
                Total Price : <b>₹{Math.round(cartTotal)}</b>
              </h6>
              <button
                className="btn my-btn-primary btn-block"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
