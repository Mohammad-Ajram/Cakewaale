import { useState, useEffect } from "react";
import Google from "../images/icons/Google.svg";
import { Link } from "react-router-dom";
import { signupCustomer } from "../functions/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { getCartDetails } from "../functions/customer";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "react-google-login";

const Signup = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactOne, setContactOne] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (customer && customer.token) history.push("/");
  }, [customer, history]);

  const handleSignup = (e) => {
    e.preventDefault();
    signupCustomer(
      name,
      email,
      password,
      contactOne,
      "",
      "",
      "",
      "",
      "dehradun",
      "uttarakhand",
      ""
    )
      .then((res) => {
        if (res.data.success === "1") {
          toast.success(
            "You have successfully signed up. Please log in to continue."
          );
          history.push("/login");
        } else toast.error("User account already exists.");
      })
      .catch((err) => console.log(err));
  };

  // const handleGoogleSignup = async () => {
  //   let intended = history.location.state;
  //   await axios
  //     .get(`${process.env.REACT_APP_API}/login/google`)
  //     .then((res) => {
  //       if (res.data.success === "1") {
  //         getCartDetails(res.data.token)
  //           .then((response) => {
  //             if (res.data.success === "1") {
  //               dispatch({
  //                 type: "LOG_IN_CUSTOMER",
  //                 payload: {
  //                   name: res.data.name,
  //                   token: res.data.token,
  //                   cartItems: response.data.cart_items,
  //                 },
  //               });
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //         if (intended) history.push(intended.from);
  //         else history.push("/");
  //       } else {
  //         if (res.data.message === "Customer not present") {
  //           toast.error("There is no account signed up with this email.");
  //           setEmail("");
  //           setPassword("");
  //         } else {
  //           toast.error("Invalid password.");
  //           setPassword("");
  //         }
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const responseGoogle = async (response) => {
    if (response.accessToken) {
      let intended = history.location.state;
      await axios
        .post(`${process.env.REACT_APP_API}/login/google`, {
          email: response.profileObj.email,
          name: response.profileObj.name,
        })
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
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Google Login failed!");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-5 col-xl-4 mx-xl-auto mx-lg-auto col-sm-10 offset-sm-1 mx-md-auto col-md-7 login px-5">
          <h4 className="login-title">Sign up</h4>
          <form onSubmit={handleSignup}>
            <label>Full name</label>
            <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            ></input>
            <br />
            <label>Email</label>
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            ></input>
            <br />
            <label>Contact</label>
            <br />
            <input
              type="number"
              value={contactOne}
              onChange={(e) => setContactOne(e.target.value)}
              className="form-control"
            ></input>
            <br />
            {/* <label>Secondary Contact (Optional)</label>
            <br />
            <input
              type="number"
              value={contactTwo}
              onChange={(e) => setContactTwo(e.target.value)}
              className="form-control"
            ></input>
            <br />
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
            <label>Select city</label>
            <select
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="dehradun">Dehradun</option>
            </select>
            <br />
            <label>Select state</label>
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
            <br /> */}
            <label>Create Password</label>
            <br />
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <br />
            <button className="btn my-btn-primary btn-block">Sign up</button>
          </form>
          <br />
          <p className="text-center">Or</p>
          <GoogleLogin
            clientId="1092069209527-ah4qn93lim76rutudu0jc7esgnuhr91d.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            render={(renderProps) => (
              <div
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                className="btn btn-google"
              >
                <img src={Google} alt="google-icon" />
                Continue with google
              </div>
            )}
          />
          <br />
          {/* <div className="btn btn-fb">
            <img src={Fb} alt="facebook-icon" />
            <span className="text-white ml-2">Continue with facebook</span>
          </div> */}
          <br />
          <p className="text-center">Already a user?</p>
          <Link to="/login" className="btn my-btn-secondary btn-block">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
