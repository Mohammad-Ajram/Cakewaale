import { useState, useEffect } from "react";
import { removeCartItem } from "../../functions/customer";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Avatar, Badge } from "antd";
import {
  getCartDetails,
  addToWishlist,
  increaseQuantity,
  decreaseQuantity,
  changeFlavour,
  changeWeight,
  changeCakeType,
  getWishlist,
  changeName,
  changeSuggestion,
} from "../../functions/customer";
import { getIndividualProduct } from "../../functions/index";
import axios from "axios";

const CartProductCard = ({
  product,
  loadCartItems,
  flavours,
  setSubTotal,
  setCartTotal,
  cartTotal,
  subTotal,
  cartItems,
  index,
}) => {
  const [weight, setWeight] = useState(product.weight);
  const [qty, setQty] = useState(product.quantity);
  const [discountedPrice, setDiscountedPrice] = useState(product.total_price);
  const discount = 100 - (product.discounted_price / product.price) * 100;
  const [price, setPrice] = useState(
    Math.round(product.total_price * (100 / (100 - discount)))
  );
  const [flavour, setFlavour] = useState(product.flavour);
  const [minWeight, setMinWeight] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [checked, setChecked] = useState(true);
  const [name, setName] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    getIndividualProduct(product.product_id).then((res) =>
      setMinWeight(res.data.Product.weight)
    );
  }, [product.product_id]);

  const increaseWeight = () => {
    if (weight < 10) {
      setDisabled(true);
      changeWeight(
        product.product_id,
        (discountedPrice / weight) * (weight + 1),
        weight + 1,
        customer.token
      ).then((res) => {
        setDisabled(false);
      });
      cartItems[index] = {
        ...cartItems[index],
        weight: weight + 1,
        total_price: (discountedPrice / weight) * (weight + 1),
      };
      setCartTotal(
        cartTotal - discountedPrice + (discountedPrice / weight) * (weight + 1)
      );
      setSubTotal(
        subTotal -
          price +
          (discountedPrice / weight) * (weight + 1) * (100 / (100 - discount))
      );
      setDiscountedPrice((discountedPrice / weight) * (weight + 1));
      setPrice(
        (discountedPrice / weight) * (weight + 1) * (100 / (100 - discount))
      );
      setWeight(weight + 1);
    }
  };
  const decreaseWeight = () => {
    if (weight > minWeight) {
      setDisabled(true);
      changeWeight(
        product.product_id,
        (discountedPrice / weight) * (weight - 1),
        weight - 1,
        customer.token
      ).then((res) => {
        setDisabled(false);
      });
      cartItems[index] = {
        ...cartItems[index],
        weight: weight - 1,
        total_price: (discountedPrice / weight) * (weight - 1),
      };
      setCartTotal(
        cartTotal - discountedPrice + (discountedPrice / weight) * (weight - 1)
      );
      setSubTotal(
        subTotal -
          price +
          (discountedPrice / weight) * (weight - 1) * (100 / (100 - discount))
      );
      setDiscountedPrice((discountedPrice / weight) * (weight - 1));
      setPrice(
        (discountedPrice / weight) * (weight - 1) * (100 / (100 - discount))
      );
      setWeight(weight - 1);
    }
  };

  const removeItem = (showToast = true) => {
    removeCartItem(product.product_id, customer.token).then((res) => {
      if (res.data.success === "1") {
        if (showToast) toast.warning("Item removed from cart!");
        loadCartItems();
        getCartDetails(customer.token)
          .then((res) => {
            if (res.data.success === "1")
              dispatch({
                type: "GET_CART",
                payload: { ...customer, cartItems: res.data.cart_items },
              });
            else
              dispatch({
                type: "GET_CART",
                payload: { ...customer, cartItems: undefined },
              });
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const addItemToWishlist = async () => {
    addToWishlist(product.product_id, minWeight, customer.token)
      .then((res) => {
        if (res.data.success === "1") {
          toast.warning("Item moved to wishlist");
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
          removeItem(false);
        } else if (
          res.data.success === "0" &&
          res.data.message === "item already in favourites"
        )
          toast.info("Item already in wishlist");
      })
      .catch((err) => console.log(err));
  };

  const uploadFiles = (e) => {
    if (e.target.files.length + product.images.length > product.max_image)
      toast.error(
        `You must only select upto ${product.max_image} images for this cake.`
      );
    else {
      let fd = new FormData();
      for (let i = 0; i < e.target.files.length; i++) {
        fd.append("file", e.target.files[i]);
      }
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API}/api/customer/upload/photocakes?id=${product.id}`,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
          "x-customer-token": customer.token,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.success === "1") {
            toast.success("Images uploaded successfully!");
            loadCartItems();
          } else toast.error("Error uploading images, please try again!");
        })
        .catch((err) => console.log(err));
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

  const chngFlavour = (e) => {
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

    setDisabled(true);
    changeFlavour(
      product.product_id,
      (discountedPrice / (weight * qty) - old + newOne) * weight * qty,
      e.target.value,
      customer.token
    ).then((res) => {
      setDisabled(false);
    });
    setFlavour(e.target.value);
    cartItems[index] = {
      ...cartItems[index],
      flavour: e.target.value,
      total_price:
        (discountedPrice / (weight * qty) - old + newOne) * weight * qty,
    };
    setCartTotal(
      cartTotal -
        discountedPrice +
        (discountedPrice / (weight * qty) - old + newOne) * weight * qty
    );
    setSubTotal(
      subTotal -
        price +
        (discountedPrice / (weight * qty) - old + newOne) *
          weight *
          qty *
          (100 / (100 - discount))
    );
    setDiscountedPrice(
      (discountedPrice / (weight * qty) - old + newOne) * weight * qty
    );
    setPrice(
      (discountedPrice / (weight * qty) - old + newOne) *
        weight *
        qty *
        (100 / (100 - discount))
    );
  };

  const incQuantity = () => {
    if (qty < 10) {
      setDisabled(true);
      increaseQuantity(
        product.product_id,
        (discountedPrice / qty) * (qty + 1),
        customer.token
      ).then((res) => {
        setDisabled(false);
      });
      setCartTotal(
        cartTotal - discountedPrice + (discountedPrice / qty) * (qty + 1)
      );
      setSubTotal(
        subTotal -
          price +
          (discountedPrice / qty) * (qty + 1) * (100 / (100 - discount))
      );
      setDiscountedPrice((discountedPrice / qty) * (qty + 1));
      setPrice((discountedPrice / qty) * (qty + 1) * (100 / (100 - discount)));
      setQty(qty + 1);
      cartItems[index] = {
        ...cartItems[index],
        quantity: qty + 1,
        total_price: (discountedPrice / qty) * (qty + 1),
      };
    }
  };

  const decQuantity = () => {
    if (qty > 1) {
      setDisabled(true);
      decreaseQuantity(
        product.product_id,
        (discountedPrice / qty) * (qty - 1),
        customer.token
      ).then((res) => {
        setDisabled(false);
      });

      setCartTotal(
        cartTotal - discountedPrice + (discountedPrice / qty) * (qty - 1)
      );
      setSubTotal(
        subTotal -
          price +
          (discountedPrice / qty) * (qty - 1) * (100 / (100 - discount))
      );
      setDiscountedPrice((discountedPrice / qty) * (qty - 1));
      setPrice((discountedPrice / qty) * (qty - 1) * (100 / (100 - discount)));
      setQty(qty - 1);
      cartItems[index] = {
        ...cartItems[index],
        quantity: qty - 1,
        total_price: (discountedPrice / qty) * (qty - 1),
      };
    }
  };

  const handleCakeStatus = () => {
    setDisabled(true);
    changeCakeType(
      product.product_id,
      discountedPrice,
      checked ? 0 : 1,
      customer.token
    ).then((res) => {
      setDisabled(false);
    });

    setChecked(!checked);
  };

  return (
    <div className="cart-product-card p-4 mb-4">
      <div className="row">
        <div className="col-sm-4 cart-card-section">
          <div className="car-product-image">
            {product && product.img && (
              <img
                src={"https://cakewaale.com" + product.img}
                alt="cake"
                className="cart-image"
              />
            )}
          </div>
          <span className="discounted-price">
            <strong>₹{Math.round(discountedPrice)}</strong>{" "}
          </span>
          <span className="original-price">
            {" "}
            <strong>₹{Math.round(price)}</strong>
          </span>
          <br />
          {product.offer > 0 && (
            <span className="discount">
              <strong>{product.offer}% off</strong>
            </span>
          )}
        </div>
        <div className="col-sm-8 cart-card-section">
          <div>
            <h5 className="d-inline-block">{product.product_name}</h5>
          </div>
          <label>
            <label className="cart-label">Cake Type</label>
            <br />
            <span className="cart-label">Eggless &nbsp;</span>
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleCakeStatus}
                checked={checked}
                disabled={disabled}
              />
              <span className="slider round"></span>
            </label>
            <span className="cart-label">&nbsp;&nbsp;Egg</span>
          </label>
          <br />
          <label className="cart-label">Quantity</label>{" "}
          <button
            className="pointer small-plus-icon"
            onClick={incQuantity}
            disabled={disabled}
          >
            <i className="fa fa-plus"></i>
          </button>
          <span className="">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {qty}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <button
            className="pointer small-plus-icon"
            onClick={decQuantity}
            disabled={disabled}
          >
            <i className="fa fa-minus"></i>
          </button>
          <br />
          <label className="cart-label">Weight</label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button
            className="pointer small-plus-icon"
            onClick={increaseWeight}
            disabled={disabled}
          >
            <i className="fa fa-plus"></i>
          </button>
          <span className="">&nbsp;{weight} Pounds&nbsp;</span>
          <button
            className="pointer small-plus-icon"
            onClick={decreaseWeight}
            disabled={disabled}
          >
            <i className="fa fa-minus"></i>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <label className="cart-label">Select Flavour</label>
          <select
            className="form-control"
            onChange={chngFlavour}
            value={flavour}
            disabled={disabled}
          >
            {flavours.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <br />
          <label className="cart-label">Name on Cake</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              changeName(
                product.product_id,
                discountedPrice,
                e.target.value,
                customer.token
              );
            }}
          />
          <br />
          <label className="cart-label">Additional Info</label>
          <input
            className="form-control"
            type="text"
            value={suggestion}
            onChange={(e) => {
              setSuggestion(e.target.value);
              changeSuggestion(
                product.product_id,
                discountedPrice,
                e.target.value,
                customer.token
              );
            }}
          />
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-4">
          <button
            className="mt-2 btn my-btn-primary btn-block"
            onClick={removeItem}
          >
            Remove
          </button>
        </div>
        <div className="col-md-8">
          <button
            className="mt-2 btn my-btn-secondary btn-block"
            onClick={addItemToWishlist}
          >
            Move to Wishlist
          </button>
        </div>
      </div>
      {product.photocake_status && (
        <div className="row">
          <div className="col-12 mt-3">
            <label className="btn my-btn-primary btn-block">
              Upload atleast one photo for this cake
              <input
                type="file"
                accept="image/*"
                encType="multipart/form-data"
                multiple
                hidden
                onChange={uploadFiles}
              ></input>
            </label>
          </div>
        </div>
      )}
      <br />
      {product.photocake_status &&
        product.images.map((item) => (
          <Badge
            count={"X"}
            onClick={async () => {
              await axios
                .delete(
                  `${process.env.REACT_APP_API}/api/customer//remove/photocakes?id=${item.id}`,
                  {
                    headers: {
                      "x-customer-token": customer.token,
                    },
                  }
                )
                .then((res) => {
                  if (res.data.success === "1") loadCartItems();
                })
                .catch((err) => console.log(err));
            }}
            className="pointer"
          >
            <Avatar
              size={100}
              src={"https://cakewaale.com" + item.image}
            ></Avatar>
          </Badge>
        ))}
    </div>
  );
};

export default CartProductCard;
