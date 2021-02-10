import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getOngoingOrders, cancelOrder } from "../../functions/customer";
import { toast } from "react-toastify";

const OngoingOrders = ({ history }) => {
  const [ongoingOrders, setOngoingOrders] = useState([]);

  const { customer } = useSelector((state) => ({ ...state }));
  if (!customer) history.push("/");

  const loadOngoingOrders = () =>
    getOngoingOrders(customer.token)
      .then((res) => {
        setOngoingOrders(res.data.Ongoing_Orders);
      })
      .catch((err) => console.log(err));
  useEffect(() => {
    const loadOngoingOrderss = () =>
      getOngoingOrders(customer.token)
        .then((res) => {
          setOngoingOrders(res.data.Ongoing_Orders);
        })
        .catch((err) => console.log(err));
    loadOngoingOrderss();
  }, [customer.token]);

  const cancelOngoingOrder = (order_id) => {
    cancelOrder(order_id, customer.token).then((res) => {
      if (res.data.success === "1") {
        loadOngoingOrders();
        toast.error("Order Cancelled");
      }
    });
  };

  return (
    <>
      <h2 className="section-title">Ongoing Orders</h2>
      <div className="container-fluid">
        <div className="row">
          {ongoingOrders.length > 0 &&
            ongoingOrders.map((item) => (
              <div
                className="col-md-8 mx-auto mb-5 p-3 order-card"
                key={item.order_id}
              >
                <h5>
                  <strong>Order Id</strong> : {item.order_id}
                </h5>
                <h5>
                  <strong>Ordered on</strong>: {item.order_date}
                </h5>
                <h5>
                  <strong>Delivery Date</strong>: {item.delivery_date}
                </h5>
                <h5>
                  <strong>Total Items({item.products.length})</strong>
                </h5>
                <ol style={{ fontSize: "16px", fontWeight: "700" }}>
                  {item.products.map((i) => (
                    <li key={i.product_id} className="mb-2">
                      <img
                        src={"https://cakewaale.com" + i.prof_img}
                        width="100px"
                        height="80px"
                        alt="cake"
                      />
                      {i.product_name}({i.weight} pounds) X {i.quantity}
                    </li>
                  ))}
                </ol>
                <h5>
                  <strong>Total Price</strong> : ₹{item.bill}
                </h5>
                <button
                  className="btn my-btn-primary btn-block"
                  onClick={() => cancelOngoingOrder(item.order_id)}
                >
                  Cancel Order
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default OngoingOrders;
