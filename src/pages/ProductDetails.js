import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getIndividualProduct } from "../functions/index";
import LoadingCard from "../components/cards/LoadingCard";
import { getFlavours, getProductsByCategory } from "../functions/index";
import { addToCart } from "../functions/customer";
import ProductCard from "../components/cards/ProductCard";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { getCartDetails, addToWishlist } from "../functions/customer";
import { Modal } from "antd";

const ProductDetails = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [flavours, setFlavours] = useState([]);
  const [flavour, setFlavour] = useState("");
  const [products, setProducts] = useState([]);
  const [weight, setWeight] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { slug } = useParams();

  const dispatch = useDispatch();

  const { customer } = useSelector((state) => ({ ...state }));

  const loadFlavours = () => {
    setLoading(true);
    getFlavours()
      .then((res) => {
        setLoading(false);
        if (res.data.success === "1") setFlavours(res.data.All_Flavours);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => loadFlavours(), []);

  const loadProducts = (c) => {
    setLoading(true);
    getProductsByCategory(
      c === "Wedding & Anniversary" || c === "Wedding & Anniversary "
        ? "Wedding%20%26%20Anniversary%20"
        : c
    )
      .then((res) => {
        setLoading(false);
        if (res.data.success === "1") setProducts(res.data.Products);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      getIndividualProduct(slug)
        .then((res) => {
          setLoading(false);
          if (res.data.success === "1") {
            setProduct(res.data.Product);
            setWeight(res.data.Product.weight);
            loadProducts(res.data.Product.category);
            setFlavour(res.data.Product.flavour);
            setDiscountedPrice(res.data.Product.discounted_price);
            setPrice(res.data.Product.price);
            setDiscount(
              Math.round(
                100 -
                  (res.data.Product.discounted_price / res.data.Product.price) *
                    100
              )
            );
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    loadProduct();
  }, [slug]);

  const increaseWeight = () => {
    if (weight < 10) {
      setDiscountedPrice((discountedPrice / weight) * (weight + 1));
      setPrice(
        (discountedPrice / weight) * (weight + 1) * (100 / (100 - discount))
      );
      setWeight(weight + 1);
    }
  };
  const decreaseWeight = () => {
    if (weight > product.weight) {
      setDiscountedPrice((discountedPrice / weight) * (weight - 1));
      setPrice(
        (discountedPrice / weight) * (weight - 1) * (100 / (100 - discount))
      );
      setWeight(weight - 1);
    }
  };

  const addItemToCart = () => {
    if (customer && customer.token) {
      addToCart(
        product.product_id,
        flavour,
        weight,
        discountedPrice,
        customer.token
      )
        .then((res) => {
          if (res.data.success === "1") {
            toast.success("Item added to cart");
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

  const calculatePrice = (e) => {
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
    setDiscountedPrice((discountedPrice / weight - old + newOne) * weight);
    setPrice(
      (discountedPrice / weight - old + newOne) *
        weight *
        (100 / (100 - discount))
    );
  };

  const addItemToWishlist = () => {
    addToWishlist(product.product_id, weight, customer.token)
      .then((res) => {
        if (res.data.success === "1") toast.success("Item added to wishlist");
        else if (
          res.data.success === "0" &&
          res.data.message === "item already in favourites"
        )
          toast.info("Item already in wishlist");
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        className="image-modal"
      >
        <img
          src={
            product.prof_img ? "https://cakewaale.com" + product.prof_img : ""
          }
          alt="cake"
          style={{ width: "100%" }}
        />
      </Modal>
      <h2 className="section-title">Cake Details</h2>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 p-md-3 p-lg-5">
            <div>
              {loading ? (
                <LoadingCard count={1} classValue="product-detail-image" />
              ) : (
                <div className="product-image-container">
                  <img
                    src={
                      product.prof_img
                        ? "https://cakewaale.com" + product.prof_img
                        : ""
                    }
                    alt="cake"
                    className="product-detail-image pointer"
                    onClick={showModal}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 pt-lg-5 pt-md-3 product-details">
            {loading ? (
              <LoadingCard count={1} classValue="" />
            ) : (
              <>
                <h3 className="mb-lg-3 mb-md-2 mb-sm-1 product-detail-title">
                  {product.product_name}
                  <div className="price-details">
                    <span className="discounted-price">
                      ₹{Math.round(discountedPrice)}{" "}
                    </span>
                    <span className="original-price">
                      {" "}
                      ₹{Math.round(price)}
                    </span>
                    {product.discount && (
                      <span className="float-right discount">
                        {product.discount}% off
                      </span>
                    )}
                  </div>
                </h3>

                <label className="product-flavour-select">Select Flavour</label>
                <select
                  className="form-control mb-1"
                  value={flavour}
                  onChange={calculatePrice}
                >
                  {flavours.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <label className="product-weight-select">Select Weight</label>
                <div className="mb-5">
                  <button
                    className="plus-icon pointer"
                    onClick={increaseWeight}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                  <span className="pound">{weight} Pounds</span>
                  <button
                    className="minus-icon pointer"
                    onClick={decreaseWeight}
                  >
                    <i className="fa fa-minus"></i>
                  </button>
                </div>

                <button
                  className="btn my-btn-primary btn-block"
                  onClick={addItemToCart}
                >
                  Add to Cart
                </button>
                <br />
                <button
                  className="btn my-btn-secondary btn-block"
                  onClick={addItemToWishlist}
                >
                  Move to wishlist
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <hr />
      <h2 className="section-title">View Similar Cakes</h2>
      <div className="container-fluid">
        <div className="row section-row">
          {loading ? (
            <LoadingCard
              count={4}
              classValue="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
            />
          ) : (
            products.length > 0 &&
            products
              .filter(
                (item, i) => i < 8 && item.product_id !== product.product_id
              )
              .map((item, i) => (
                <div
                  className="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
                  key={i}
                >
                  <ProductCard
                    name={item.product_name}
                    img={item.prof_img}
                    id={item.product_id}
                    discountedPrice={item.discounted_price}
                    discount={item.offer}
                    price={item.price}
                    weight={item.weight}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
