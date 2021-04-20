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
        if (res.data.Ongoing_Orders) setOngoingOrders(res.data.Ongoing_Orders);
      })
      .catch((err) => console.log(err));
  useEffect(() => {
    const loadOngoingOrderss = () =>
      getOngoingOrders(customer.token)
        .then((res) => {
          if (res.data.Ongoing_Orders)
            setOngoingOrders(res.data.Ongoing_Orders);
          else setOngoingOrders([]);
        })
        .catch((err) => console.log(err));
    loadOngoingOrderss();
  }, [customer.token]);

  const cancelOngoingOrder = (order_id, online_status) => {
    cancelOrder(order_id, customer.token).then((res) => {
      if (res.data.success === "1") {
        loadOngoingOrders();
        if (online_status === "0") toast.error("Order Cancelled");
        else
          toast.error(
            "Order Cancelled. Your payment will be refunded within 24 hrs. If payment doesn't get refunded within 24 hrs then contact us at +91-7017554779"
          );
      }
    });
  };

  return (
    <>
      <h2 className="section-title">Ongoing Orders</h2>
      <div className="container-fluid">
        <div className="row">
          {ongoingOrders.length > 0 &&
            ongoingOrders.reverse().map((item) => (
              <div
                className="col-md-8 mx-auto mb-5 p-3 order-card col-10"
                key={item.order_id}
              >
                <h6>
                  <strong>Order Id</strong> : {item.order_id}
                </h6>
                <h6>
                  <strong>Ordered on</strong>: {item.order_date}
                </h6>
                <h6>
                  <strong>Delivery Date</strong>: {item.delivery_date}
                </h6>
                <h6>
                  <strong>Total Items({item.products.length})</strong>
                </h6>
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
                <h6>
                  <strong>Total Bill : ₹{item.total_bill}</strong>
                </h6>
                <button
                  className="btn my-btn-primary btn-block"
                  onClick={() =>
                    cancelOngoingOrder(item.order_id, item.online_status)
                  }
                >
                  Cancel Order
                </button>
              </div>
            ))}
          {ongoingOrders.length === 0 && (
            <div className="mb-5 ml-3 pb-5">
              {" "}
              <h3 className="text-center">There are no ongoing orders.</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OngoingOrders;
