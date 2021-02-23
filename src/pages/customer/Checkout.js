import CheckoutProductCard from "../../components/cards/CheckoutProductCard";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  getProfile,
  placeOrder,
  getCartDetails,
} from "../../functions/customer";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../images/logo.png";
import { useDispatch } from "react-redux";
import { Modal } from "antd";

const Checkout = ({ history }) => {
  const [hNo, setHNo] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState("0");

  const [city, setCity] = useState("dehradun");
  const [state, setState] = useState("uttarakhand");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const dispatch = useDispatch();

  const { customer } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getCartDetails(customer.token)
      .then((res) => {
        if (res.data.success === "1") setProducts(res.data.cart_items);
      })
      .catch((err) => console.log(err));
  }, []);

  let intended = history.location.state;
  if (!intended || !customer) history.push("/");

  let total = 0;
  if (customer && customer.cartItems) {
    for (let i = 0; i < customer.cartItems.length; i++) {
      total += customer.cartItems[i].total_price;
    }
  }

  useEffect(() => {
    getProfile(customer.token).then((res) => {
      setHNo(res.data.customer_detail.delivery_houseNo);
      setLocality(res.data.customer_detail.delivery_locality);
      setLandmark(res.data.customer_detail.delivery_landmark);
      setPincode(res.data.customer_detail.delivery_pincode);
      setPhone(res.data.customer_detail.contact_one);
      setEmail(res.data.customer_detail.email);
    });
  }, [customer.token]);

  //razorpay integration
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(result) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, order_id } = result.data;

    const options = {
      key: "rzp_test_76kOqpWsAqbalP", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: "INR",
      name: "Cakewaale",
      description: "Cake  Transaction",
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          order_id: order_id,
          razorpay_payment_id: response.razorpay_payment_id,

          razorpay_signature: response.razorpay_signature,
          pickup: paymentMethod === "1" ? "0" : "1",
          delivery_date: deliveryDate + " " + deliveryTime + ":00",
        };

        await axios.post("https://cakewaale.com/api/customer/success", data, {
          headers: {
            "x-customer-token": customer.token,
          },
        });
        toast.success(
          "Your order has been successfully placed. Thank you for shopping with us!"
        );
        dispatch({
          type: "GET_CART",
          payload: { ...customer, cartItems: undefined },
        });

        history.push("/");
      },
      prefill: {
        name: customer.name,
        email: email,
        contact: phone,
      },
      notes: {
        address: "Cakewaale Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", async function (response) {
      const result = await axios.post(
        "https://cakewaale.com/api/customer/failure",
        { order_id },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      );
      console.log(result.data);
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    paymentObject.open();
  }

  const handleOrder = () => {
    if (!paymentMethod) toast.error("Pleaseselect payment method");
    else if (!deliveryDate || !deliveryTime)
      toast.error("Please select delivery time and date");
    else if (range === "0") toast.error("Please select range");
    else
      placeOrder(
        deliveryDate + " " + deliveryTime + ":00",
        paymentMethod === "3" ? "1" : paymentMethod,
        range,
        customer.token
      )
        .then((res) => {
          if (res.data.success === "1") {
            if (paymentMethod === "0" || paymentMethod === "1") {
              toast.success(
                "Order successfully placed. Thank you for shopping with us!"
              );
              history.push("/");
            } else displayRazorpay(res);
          }
        })
        .catch((err) => console.log(err));
  };

  const changeAddress = async (e) => {
    e.preventDefault();
    console.log("address");
    setIsModalVisible(false);
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          address: "delivery",
          houseNo: hNo,
          locality,
          landmark,
          city,
          state,
          pincode,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => toast.success("Address Changed"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Modal
        title="Change Address"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <form onSubmit={changeAddress}>
          <label>House No.</label>
          <br />
          <input
            type="number"
            value={hNo}
            onChange={(e) => setHNo(e.target.value)}
            className="form-control"
          ></input>
          <br />
          <label>Landmark</label>
          <br />
          <input
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="form-control"
          ></input>
          <br />
          <label>Locality</label>
          <br />
          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="form-control"
          ></input>
          <br />
          <label>City</label>
          <select
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="dehradun">Dehradun</option>
          </select>
          <br />
          <label>State</label>
          <select
            className="form-control"
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="uttarakhand">Uttarakhand</option>
          </select>
          <br />
          <label>Pincode</label>
          <br />
          <input
            type="number"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="form-control"
          ></input>
          <br />
          <button className="btn my-btn-primary btn-block">
            Update Address
          </button>
        </form>
      </Modal>
      <h2 className="section-title">Checkout</h2>
      <div className="conatiner-fluid">
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-8 px-5">
            <label className="checkout-label">Deliver to this address</label>
            <textarea
              disabled
              className="form-control"
              style={{ resize: "none", height: "100px", width: "90%" }}
              value={
                hNo +
                ", " +
                locality +
                ", " +
                "Near " +
                landmark +
                "\n " +
                "Dehradun, Uttarakhand -" +
                pincode
              }
            ></textarea>
            <br />
            <button className="btn my-btn-primary" onClick={showModal}>
              Update Address
            </button>
            {/* <button className="btn my-btn-secondary ml-1">
              Update Address
            </button> */}
            <br />
            <label className="checkout-label">Select payment options</label>
            <br />
            <input
              type="radio"
              name="payment_method"
              value="0"
              checked={paymentMethod === "0"}
              onChange={(e) => {
                setPaymentMethod("0");
                window.alert(
                  "We are operating from Garhi Cantt and charging a minimal of Rs 10 per kilometer"
                );
              }}
            />
            &nbsp; Cash on delivery
            <br />
            <input
              type="radio"
              name="payment_method"
              value="1"
              checked={paymentMethod === "1"}
              onChange={(e) => setPaymentMethod("1")}
            />
            &nbsp;Pay online and get delivered to specified address
            <br />
            <input
              type="radio"
              name="payment_method"
              value="2"
              checked={paymentMethod === "2"}
              onChange={(e) => {
                setPaymentMethod("2");
                window.alert(
                  "Please take the screenshot of the pickup address: 4L/1 Garhi Cantt, near D.D. College, Rajendra Nagar, Ballupur Chowk, Dehradun. Contact Number: +91 7253020679"
                );
              }}
            />
            &nbsp;Pick myself
            <br />
            <input
              type="radio"
              name="payment_method"
              value="3"
              checked={paymentMethod === "3"}
              onChange={(e) => {
                setPaymentMethod("3");
                window.alert(
                  "Please take the screenshot of the pickup address: 4L/1 Garhi Cantt, near D.D. College, Rajendra Nagar, Ballupur Chowk, Dehradun. Contact Number: +91 7253020679"
                );
              }}
            />
            &nbsp;Pay online and pick myself
            <br />
            {/* <label className="checkout-label">Have promocode?</label>
            <br />
            <input type="text" className="form-control" />
            <br /> */}
            <label className="checkout-label">Select delivery date</label>
            <input
              type="date"
              className="form-control"
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
            <label className="checkout-label">Select delivery time</label>
            <input
              type="time"
              className="form-control"
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
            <label className="checkout-label">Range : {range} km</label>
            <input
              type="range"
              min="0"
              max="100"
              value={range}
              className="form-control"
              onChange={(e) => setRange(e.target.value)}
            />
          </div>
          <div className="col-md-4 mt-5 px-5">
            <h4 className="order-summary-title">
              Order Summary
              <br />({customer.cartItems ? customer.cartItems.length : 0} items)
            </h4>
            <br />
            {products.length > 0 &&
              products.map((item) => (
                <CheckoutProductCard key={item.product_id} product={item} />
              ))}
            <hr />
            <span style={{ width: "100%" }}>
              <label className="checkout-label">Total</label>
              <label className="float-right checkout-label">
                <strong>₹{total}</strong>
              </label>
            </span>
            <button
              className="btn my-btn-primary btn-block"
              onClick={handleOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
