import { useState, useEffect } from "react";
import { removeWishlistItem, getCartDetails } from "../../functions/customer";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, getWishlist } from "../../functions/customer";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { getFlavours, getIndividualProduct } from "../../functions/index";

const WishlistProductCard = ({ product, loadWishlist }) => {
  const [weight, setWeight] = useState(product.weight);
  const [flavour, setFlavour] = useState(product.flavour);
  const [flavours, setFlavours] = useState([]);
  const [discountedPrice, setDiscountedPrice] = useState(
    product.discounted_price
  );
  const [price, setPrice] = useState(product.price);
  const [minWeight, setMinWeight] = useState(1);

  const discount = 100 - (product.discounted_price / product.price) * 100;

  console.log("DIscount", discount);

  const { customer } = useSelector((state) => ({ ...state }));

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    getIndividualProduct(product.product_id).then((res) =>
      setMinWeight(res.data.Product.weight)
    );
  }, [product.product_id]);

  useEffect(() => {
    getFlavours()
      .then((res) => {
        if (res.data.success === "1") setFlavours(res.data.All_Flavours);
      })
      .catch((err) => console.log(err));
  }, []);

  const increaseWeight = () => {
    if (weight < 10) {
      setDiscountedPrice(Math.round((discountedPrice / weight) * (weight + 1)));
      setPrice(
        Math.round(
          Math.round((discountedPrice / weight) * (weight + 1)) *
            (100 / (100 - discount))
        )
      );
      setWeight(weight + 1);
    }
  };
  const decreaseWeight = () => {
    if (weight > minWeight) {
      setDiscountedPrice(Math.round((discountedPrice / weight) * (weight - 1)));
      setPrice(
        Math.round(
          Math.round((discountedPrice / weight) * (weight + 1)) *
            (100 / (100 - discount))
        )
      );
      setWeight(weight - 1);
    }
  };

  const removeFromWishlist = (showToast = true) => {
    removeWishlistItem(product.product_id, customer.token)
      .then((res) => {
        loadWishlist();
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
        if (res.data.success === "1" && showToast) {
          toast.warning("Item removed from wishlist");
        }
      })
      .catch((err) => console.log(err));
  };

  const addItemToCart = () => {
    if (customer && customer.token) {
      addToCart(
        product.product_id,
        flavour,
        weight,
        product.discounted_price,
        customer.token
      )
        .then((res) => {
          if (res.data.success === "1") {
            loadWishlist();
            toast.success("Item added to cart");
            removeFromWishlist(false);
            getCartDetails(customer.token)
              .then((response) => {
                if (response.data.success === "1")
                  dispatch({
                    type: "GET_CART",
                    payload: {
                      ...customer,
                      cartItems: response.data.cart_items,
                    },
                  });
              })
              .catch((err) => console.log(err));
          } else if (
            res.data.success === "0" &&
            res.data.message === "Item already in cart"
          )
            toast.error("Item already in the cart");
        })
        .catch((err) => console.log(err));
    } else {
      history.push({
        pathname: "/login",
        state: { from: history.location.pathname },
      });
    }
  };

  /* Setting price on flavour change */
  const fruit = 280;
  const blackForest = 280;
  const coffeeMocha = 290;
  const truffle = 330;
  const chocolateOrange = 330;
  const blueberryChocolate = 330;
  const hazelnut = 580;
  const whiteForest = 290;
  const tiramisu = 430;
  const redVelvetTruffle = 330;
  const oreo = 310;
  const pineapple = 230;
  const strawberry = 250;
  const redVelvet = 280;
  const redVelvetCheeseCream = 480;
  const cookieAndCream = 310;
  const butterscotch = 250;
  const chocolate = 280;
  const chocolateVanilla = 330;
  const blueberry = 310;
  const hazelnutCoffee = 580;

  const changeFlavour = (e) => {
    let old, newOne;
    /*Setting the old cream + flavour price */
    if (flavour === "chocolate") old = chocolate;
    else if (flavour === "truffle") old = truffle;
    else if (flavour === "hazelnut") old = hazelnut;
    else if (flavour === "red velvet") old = redVelvet;
    else if (flavour === "fruit") old = fruit;
    else if (flavour === "coffee mocha") old = coffeeMocha;
    else if (flavour === "black forest") old = blackForest;
    else if (flavour === "blueberry") old = blueberry;
    else if (flavour === "tiramisu") old = tiramisu;
    else if (flavour === "butterscotch") old = butterscotch;
    else if (flavour === "cookie & cream") old = cookieAndCream;
    else if (flavour === "pineapple") old = pineapple;
    else if (flavour === "chocolate vanilla") old = chocolateVanilla;
    else if (flavour === "oreo") old = oreo;
    else if (flavour === "red velvet truffle") old = redVelvetTruffle;
    else if (flavour === "white forest") old = whiteForest;
    else if (flavour === "strawberry") old = strawberry;
    else if (flavour === "red velvet cream cheese") old = redVelvetCheeseCream;
    else if (flavour === "hazelnut coffee") old = hazelnutCoffee;
    else if (flavour === "blueberry chocolate") old = blueberryChocolate;
    else if (flavour === "chocolate orange") old = chocolateOrange;

    /*Setting the old cream + flavour price */
    if (e.target.value === "chocolate") newOne = chocolate;
    else if (e.target.value === "truffle") newOne = truffle;
    else if (e.target.value === "hazelnut") newOne = hazelnut;
    else if (e.target.value === "red velvet") newOne = redVelvet;
    else if (e.target.value === "fruit") newOne = fruit;
    else if (e.target.value === "coffee mocha") newOne = coffeeMocha;
    else if (e.target.value === "black forest") newOne = blackForest;
    else if (e.target.value === "blueberry") newOne = blueberry;
    else if (e.target.value === "tiramisu") newOne = tiramisu;
    else if (e.target.value === "butterscotch") newOne = butterscotch;
    else if (e.target.value === "cookie & cream") newOne = cookieAndCream;
    else if (e.target.value === "pineapple") newOne = pineapple;
    else if (e.target.value === "chocolate vanilla") newOne = chocolateVanilla;
    else if (e.target.value === "oreo") newOne = oreo;
    else if (e.target.value === "red velvet truffle") newOne = redVelvetTruffle;
    else if (e.target.value === "white forest") newOne = whiteForest;
    else if (e.target.value === "strawberry") newOne = strawberry;
    else if (e.target.value === "red velvet cream cheese")
      newOne = redVelvetCheeseCream;
    else if (e.target.value === "hazelnut coffee") newOne = hazelnutCoffee;
    else if (e.target.value === "blueberry chocolate")
      newOne = blueberryChocolate;
    else if (e.target.value === "chocolate orange") newOne = chocolateOrange;

    setFlavour(e.target.value);
    setDiscountedPrice(
      Math.round((discountedPrice / weight - old + newOne) * weight)
    );
    setPrice(
      Math.round(
        Math.round((discountedPrice / weight - old + newOne) * weight) *
          (100 / (100 - discount))
      )
    );
  };

  return (
    <div className="col-md-6 mb-4">
      <div className="wishlist-product-card">
        <div className="row ">
          <div className="col-4">
            <div className="wishlist-product-image">
              {product.prof_img && (
                <img
                  src={"https://cakewaale.com" + product.prof_img}
                  alt="Cake"
                  className="wishlist-image"
                />
              )}
            </div>
            <span className="discounted-price">
              <strong>₹{discountedPrice}</strong>{" "}
            </span>
            <span className="original-price">
              {" "}
              <strong>₹{price}</strong>
            </span>
            <br />
            {product.offer > 0 && (
              <span className="discount">
                <strong>{product.offer}% off</strong>
              </span>
            )}
          </div>
          <div className="col-8 wishlist-right">
            <h6 className="wishlist-product-title">{product.product_name}</h6>
            <label className="wishlist-label">Select Weight</label>
            &nbsp;&nbsp;
            <button
              className="pointer small-plus-icon"
              onClick={increaseWeight}
            >
              <i className="fa fa-plus"></i>
            </button>
            &nbsp;&nbsp;
            <span className="weight">{weight} Pounds</span>
            &nbsp;&nbsp;
            <button
              className="pointer small-plus-icon"
              onClick={decreaseWeight}
            >
              <i className="fa fa-minus"></i>
            </button>
            <br />
            <label className="wishlist-label">Select flavour</label>
            &nbsp;&nbsp;
            <select
              onChange={changeFlavour}
              style={{ width: "50%", height: "22px" }}
            >
              {flavours.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button
              className="btn my-btn-primary btn-block"
              onClick={addItemToCart}
            >
              Add to Cart
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn my-btn-secondary btn-block"
              onClick={removeFromWishlist}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistProductCard;
