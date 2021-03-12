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
  console.log(previousOrders);

  return (
    <>
      <h2 className="section-title">Previous Orders</h2>
      <div className="container-fluid">
        <div className="row">
          {previousOrders.length > 0 &&
            previousOrders.map((item) => (
              <div
                className="col-md-8 mx-auto col-10 mb-5 p-3 order-card"
                key={item.order_id}
              >
                <h6>
                  <b>Order Id</b> : {item.order_id}
                </h6>
                <h6>
                  <b>Delivered on</b>: {item.complete_date}
                </h6>
                <h6>
                  <b>Total Items({item.products.length})</b>
                </h6>
                <ol style={{ fontSize: "14px", fontWeight: "700" }}>
                  {item.products.map((i) => (
                    <li key={i.product_id} className="mb-2">
                      <img
                        src={"https://cakewaale.com" + i.prof_img}
                        style={{ borderRadius: "5px" }}
                        width="100px"
                        height="80px"
                        alt="cake"
                      />
                      &nbsp;{i.product_name}({i.weight} pounds) X {i.quantity}
                    </li>
                  ))}
                </ol>
                <h6>
                  <strong>Total Bill : ₹{item.total_bill}</strong>
                </h6>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default PreviousOrders;
