import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getPreviousOrders } from "../../functions/customer";

const PreviousOrders = ({ history }) => {
  const [previousOrders, setPreviousOrders] = useState([]);

  const { customer } = useSelector((state) => ({ ...state }));
  if (!customer) history.push("/");
  useEffect(() => {
    const loadPreviousOrders = () =>
      getPreviousOrders(customer.token)
        .then((res) => {
          setPreviousOrders(
            res.data.Previous_Orders ? res.data.Previous_Orders : []
          );
        })
        .catch((err) => console.log(err));
    loadPreviousOrders();
  }, [customer.token]);

  return (
    <>
      <h2 className="section-title">Previous Orders</h2>
      <div className="container-fluid">
        <div className="row">
          {previousOrders.length > 0 &&
            previousOrders.map((item) => (
              <div
                className="col-md-8 mx-auto mb-5 p-3 order-card"
                key={item.order_id}
              >
                <h5>Order Id : {item.order_id}</h5>
                <h5>Order on: {item.order_date}</h5>
                <h5>Delivered on: {item.delivery_date}</h5>
                <ol style={{ fontSize: "14px", fontWeight: "700" }}>
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
                <h5>Total Price : ₹{item.bill}</h5>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PreviousOrders;
