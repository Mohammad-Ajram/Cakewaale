import "../stylesheets/login.css";
import Google from "../images/icons/Google.svg";
import Fb from "../images/icons/Facebook.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginCustomer } from "../functions/auth";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCartDetails } from "../functions/customer";

const Login = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { customer } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (customer && customer.token) history.push("/");
  }, [customer, history]);

  const handleLogin = (e) => {
    e.preventDefault();
    let intended = history.location.state;
    loginCustomer(email, password)
      .then((res) => {
        if (res.data.success === "1") {
          getCartDetails(res.data.token)
            .then((response) => {
              if (res.data.success === "1") {
                dispatch({
                  type: "LOG_IN_CUSTOMER",
                  payload: {
                    name: res.data.name,
                    token: res.data.token,
                    cartItems: response.data.cart_items,
                  },
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
          if (intended) history.push(intended.from);
          else history.push("/");
        } else {
          if (res.data.message === "Customer not present") {
            toast.error("There is no account signed up with this email.");
            setEmail("");
            setPassword("");
          } else {
            toast.error("Invalid password.");
            setPassword("");
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleGoogleLogin = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/login/google`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-xl-4 mx-xl-auto mx-lg-auto col-sm-10 offset-sm-1 mx-md-auto col-md-7 login px-5">
          <h4 className="login-title">Login</h4>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <br />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            ></input>
            <br />
            <label>Password</label>
            <br />
            <input
              required
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <br />
            <button className="btn my-btn-primary btn-block">Log in</button>
            <br />
            <p className="text-center">Or</p>
            <div className="btn btn-google" onClick={handleGoogleLogin}>
              <img src={Google} alt="google-icon" />
              Continue with google
            </div>
            <br />
            <div className="btn btn-fb">
              <img src={Fb} alt="facebook-icon" />
              <span className="text-white ml-2">Continue with facebook</span>
            </div>
            <br />
            <p className="text-center">Not a user?</p>
            <Link to="/signup" className="btn my-btn-secondary btn-block">
              Sign up
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
