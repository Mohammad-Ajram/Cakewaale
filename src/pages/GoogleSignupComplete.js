import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const GoogleSignupComplete = ({ history }) => {
  const [contact, setContact] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

  if (!history.location.state) history.push("/");

  const completeSignup = async () => {
    let intended = history.location.state;
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          contact_one: contact,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => {
        if (res.data.success === "1") {
          toast.success("Successfully signed up using Google.");
          if (intended) history.push(intended.from);
          else history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="mt-5 col-lg-5 col-xl-4 mx-xl-auto mx-lg-auto col-sm-10 offset-sm-1 mx-md-auto col-md-7 login px-5">
            <h4 className="login-title">Please provide your contact number</h4>
            <input
              type="number"
              className="form-control"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <br />
            <button
              className="btn my-btn-primary btn-block"
              onClick={completeSignup}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleSignupComplete;
