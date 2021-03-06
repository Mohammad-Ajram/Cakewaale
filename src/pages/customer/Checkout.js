import CheckoutProductCard from "../../components/cards/CheckoutProductCard";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
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
import { checkPromo } from "../../functions/customer";
import Map from "../../components/Map";

const Checkout = ({ history }) => {
  const [contact, setContact] = useState("");
  const [hNo, setHNo] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCodModalVisible, setIsCodModalVisible] = useState(false);
  // const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isPickMyselfModalVisible, setIsPickMyselfModalVisible] =
    useState(false);
  const [products, setProducts] = useState([]);
  const [range, setRange] = useState("0");

  const [city, setCity] = useState("Dehradun");
  const [state, setState] = useState("Uttarakhand");

  const input1 = useRef(null);

  const handleOk = () => {
    setIsModalVisible(false);
    setIsCodModalVisible(false);
    setIsPickMyselfModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsCodModalVisible(false);
    setIsPickMyselfModalVisible(false);
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
      setContact(res.data.customer_detail.contact_one);
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
      key: "rzp_live_BUrew3klYGQQzr", // Enter the Key ID generated from the Dashboard
      amount: amount ? amount.toString() : "",
      currency: "INR",
      name: "Cakewaale",
      description: "Cake  Transaction",
      image: logo,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          order_id: order_id,
          razorpay_payment_id: response.razorpay_payment_id,

          razorpay_signature: response.razorpay_signature,
          pickup: paymentMethod === "1" ? "0" : "1",
          delivery_date: deliveryDate + " " + deliveryTime + ":00",
          range: String(range),
          promo: String(
            Math.round((couponDiscount / 100) * (total + range * 10))
          ),
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
        contact: contact,
      },
      notes: {
        address: "Cakewaale Corporate Office",
      },
      theme: {
        color: "#cb202d",
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
    if (!paymentMethod) toast.error("Please select payment method");
    else if (!deliveryDate || !deliveryTime)
      toast.error("Please select delivery time and date");
    else if (!locality && (paymentMethod === "0" || paymentMethod === "1"))
      toast.error("Please mark your delivery location on map");
    else if (input1.current.value.length !== 10)
      toast.error("Please provide your valid contact number");
    else if (city.toLowerCase() !== "dehradun")
      toast.error("We are delivering only in Dehradun right now.");
    else
      placeOrder(
        deliveryDate + " " + deliveryTime + ":00",
        paymentMethod === "3" ? "1" : paymentMethod,
        String(range),
        String(Math.round((couponDiscount / 100) * (total + range * 10))),
        customer.token
      )
        .then((res) => {
          if (res.data.success === "1") {
            if (paymentMethod === "0" || paymentMethod === "2") {
              toast.success(
                "Order successfully placed. Thank you for shopping with us!"
              );
              dispatch({
                type: "GET_CART",
                payload: { ...customer, cartItems: undefined },
              });
              history.push("/");
            } else displayRazorpay(res);
          }
        })
        .catch((err) => console.log(err));
  };

  const changeAddress = async (
    address,
    area,
    city,
    state,
    pincode,
    lat,
    lon
  ) => {
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          address: "delivery",
          houseNo: "0",
          locality: address,
          landmark: area,
          city,
          state,
          pincode,
          lat,
          lon,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => {
        if (res.data.success === "1") console.log("Address Changed");
      })
      .catch((err) => console.log(err));
  };

  // const changeContact = async (e) => {
  //   e.preventDefault();

  //   await axios
  //     .put(
  //       `${process.env.REACT_APP_API}/api/customer/profile/update`,
  //       {
  //         contact_one: input1.current.value,
  //       },
  //       {
  //         headers: {
  //           "x-customer-token": customer.token,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       if (res.data.success === "1") {
  //         toast.success("Contact Updated");
  //         setContact(input1.current.value);
  //         setIsContactModalVisible(false);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const showCodModal = () => setIsCodModalVisible(true);

  const showPickMyselfModal = () => setIsPickMyselfModalVisible(true);

  const ndate =
    new Date().getDate().toString().length === 1
      ? "0" + new Date().getDate().toString()
      : new Date().getDate().toString();
  const month =
    (new Date().getMonth() + 1).toString().length === 1
      ? "0" + (new Date().getMonth() + 1).toString()
      : (new Date().getMonth() + 1).toString();

  const minDate = `${new Date().getFullYear()}-${month}-${ndate}`;

  const applyCoupon = () => {
    checkPromo(promo, customer.token)
      .then((res) => {
        if (res.data.success === "1") {
          toast.success("Promocode Applied");
          setCouponDiscount(res.data.discount);
        } else {
          toast.error("Invalid promocode");
        }
      })
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
        <div className="px-4 pb-4">
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
        </div>
      </Modal>
      {/* <Modal
        title="Update your contact number"
        visible={isContactModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className="px-4 pb-2">
          <label>Enter your contact number</label>
          <div class="input-group prefix">
            <span class="input-group-addon ">+91</span>
            <input
              type="number"
              ref={input1}
              className="form-control"
              style={{ width: "100%" }}
              defaultValue={contact}
            />
          </div>
          <br />
          <button
            className="btn my-btn-primary btn-block"
            onClick={changeContact}
          >
            Update Contact No.
          </button>
        </div>
      </Modal> */}
      <Modal
        title="Important Notice"
        visible={isCodModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className="px-4 pb-2">
          <p>
            We are operating from Garhi Cantt and charging a minimal of Rs 10
            per kilometer
          </p>
        </div>
      </Modal>
      <Modal
        title="Important Notice"
        visible={isPickMyselfModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className="px-4 pb-2">
          {" "}
          <p>
            Please take the screenshot of the pickup address: 4L/1 Garhi Cantt,
            near D.D. College, Rajendra Nagar, Ballupur Chowk, Dehradun. Contact
            Number: +91 7253020679
          </p>
        </div>
      </Modal>
      <h2 className="section-title">Checkout</h2>
      <div className="conatiner-fluid">
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-8 px-5">
            <label className="checkout-label">Select payment options</label>
            <br />
            <input
              type="radio"
              name="payment_method"
              value="0"
              checked={paymentMethod === "0"}
              onChange={(e) => {
                setPaymentMethod("0");
                showCodModal();
              }}
            />
            &nbsp; <span className="radio-label">Cash on delivery</span>
            <br />
            <input
              type="radio"
              name="payment_method"
              value="1"
              checked={paymentMethod === "1"}
              onChange={(e) => setPaymentMethod("1")}
            />
            &nbsp;
            <span className="radio-label">
              Pay online and get delivered to specified address
            </span>
            <br />
            <input
              type="radio"
              name="payment_method"
              value="2"
              checked={paymentMethod === "2"}
              onChange={(e) => {
                setPaymentMethod("2");
                showPickMyselfModal();
              }}
            />
            &nbsp;
            <span className="radio-label">
              Pick myself and pay cash at our store
            </span>
            <br />
            <input
              type="radio"
              name="payment_method"
              value="3"
              checked={paymentMethod === "3"}
              onChange={(e) => {
                setPaymentMethod("3");
                showPickMyselfModal();
              }}
            />
            &nbsp;
            <span className="radio-label">Pay online and pick myself</span>
            <br />
            <br />
            {/*{" "}
                <textarea
                  disabled
                  className="form-control"
                  style={{ resize: "none", height: "100px", width: "90%" }}
                  value={
                    !hNo || !locality || !landmark || !pincode
                      ? ""
                      : hNo +
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
                </button>{" "}
                */}
            {(paymentMethod === "0" || paymentMethod === "1") && (
              <>
                <label className="checkout-label">
                  Mark your delivery location on map
                </label>

                <Map
                  center={{ lat: 30.353050987984094, lng: 78.02502274032297 }}
                  height="300px"
                  zoom={15}
                  setRange={setRange}
                  changeAddress={changeAddress}
                  setCity={setCity}
                  setLocality={setLocality}
                />
                <br />
                <br />
              </>
            )}
            {/* <label className="checkout-label">Have promocode?</label>
            <br />
            <input type="text" className="form-control" />
            <br /> */}
            <label className="checkout-label">Provide your Contact No.</label>
            <br />
            <div className="input-group prefix">
              <span className="input-group-addon ">+91</span>
              <input
                type="number"
                ref={input1}
                className="form-control"
                style={{ width: "100%" }}
                defaultValue={contact}
              />
            </div>
            <br />
            <label className="checkout-label">Select delivery date</label>
            <input
              type="date"
              min={minDate}
              className="form-control"
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
            <br />
            <label className="checkout-label">Select delivery time</label>
            <input
              type="time"
              className="form-control"
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
            {/* {(paymentMethod === "0" || paymentMethod === "1") && (
              <>
                <p className="budget checkout-label">
                  Select your expected distance from Ballupur Chowk
                </p>
                <div class="slidecontainer">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={range}
                    className="range-slider"
                    onChange={(e) => setRange(e.target.value)}
                    id="myRange"
                  />
                  <p className="text-center">
                    <strong>{range} kms</strong>
                  </p>
                </div>
              </>
            )} */}
            <br />
            <label className="checkout-label">Have Promocode?</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setPromo(e.target.value)}
            />
            <br />
            <button className="btn my-btn-primary" onClick={applyCoupon}>
              Apply
            </button>
          </div>
          <div className="col-md-4 mt-5 px-5">
            <h4 className="order-summary-title">Order Summary</h4>
            <h4 className="order-summary-title">
              ({customer.cartItems ? customer.cartItems.length : 0} items)
            </h4>
            <br />
            {products.length > 0 &&
              products.map((item) => (
                <CheckoutProductCard key={item.product_id} product={item} />
              ))}
            <hr />
            {range !== "0" && city.toLowerCase() === "dehradun" && (
              <div style={{ width: "100%" }}>
                <span className="checkout-label">Delivery Charges</span>
                <span className="float-right checkout-label">
                  <strong>₹{range * 10}</strong>
                </span>
                <br />

                <span className="checkout-label">
                  <small>
                    Your approximate distance from our store is {range} kms
                  </small>
                </span>
              </div>
            )}
            <br />
            <div style={{ width: "100%" }}>
              <span className="checkout-label">
                Total{" "}
                {range !== "0" && city.toLowerCase() === "dehradun" && (
                  <small>(including delivery charges)</small>
                )}
              </span>
              <span className="float-right checkout-label">
                <strong>
                  ₹
                  {range !== "0" && city.toLowerCase() === "dehradun"
                    ? total + range * 10
                    : total}
                </strong>
              </span>
            </div>
            {couponDiscount > 0 && (
              <>
                <br />
                <div style={{ width: "100%" }}>
                  <span className="checkout-label">Promocode Discount</span>
                  <span className="float-right checkout-label">
                    <strong>
                      ₹
                      {Math.round(
                        (couponDiscount / 100) * (total + range * 10)
                      )}
                    </strong>
                  </span>
                </div>
                <hr />
                <div style={{ width: "100%" }}>
                  <span className="checkout-label">
                    Total<small>(after applying promocode)</small>
                  </span>
                  <span className="float-right checkout-label">
                    <strong>
                      ₹
                      {Math.round(
                        ((100 - couponDiscount) / 100) * (total + range * 10)
                      )}
                    </strong>
                  </span>
                </div>
              </>
            )}
            <br />
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
