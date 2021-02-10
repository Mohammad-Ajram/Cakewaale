import { getProfile } from "../../functions/customer";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactOne, setContactOne] = useState("");
  const [contactTwo, setContactTwo] = useState("");
  const [hNo, setHNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("dehradun");
  const [state, setState] = useState("uttarakhand");
  const [pincode, setPincode] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

  if (!customer) history.push("/");

  useEffect(() => {
    const loadProfile = () => {
      if (customer && customer.token)
        getProfile(customer.token)
          .then((res) => {
            setName(res.data.customer_detail.name);
            setEmail(res.data.customer_detail.email);
            setContactOne(res.data.customer_detail.contact_one);
            setContactTwo(
              res.data.customer_detail.contact_two
                ? res.data.customer_detail.contact_two
                : ""
            );
            setHNo(res.data.customer_detail.delivery_houseNo);
            setLandmark(res.data.customer_detail.delivery_landmark);
            setLocality(res.data.customer_detail.delivery_locality);
            setPincode(res.data.customer_detail.delivery_pincode);
          })
          .catch((err) => console.log(err));
    };
    loadProfile();
  }, [customer]);

  const changeName = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          name,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => {
        if (res.data.success === "1") toast.success("Name Changed");
      })
      .catch((err) => console.log(err));
  };
  const changeEmail = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          email,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => {
        if (res.data.success === "1") toast.success("Email Changed");
      })
      .catch((err) => console.log(err));
  };

  const changeContact = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          contact_one: contactOne,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => {
        if (res.data.success === "1") toast.success("Contact Changed");
      })
      .catch((err) => console.log(err));
  };

  const changeSecondaryContact = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${process.env.REACT_APP_API}/api/customer/profile/update`,
        {
          contact_two: contactTwo,
        },
        {
          headers: {
            "x-customer-token": customer.token,
          },
        }
      )
      .then((res) => {
        if (res.data.success === "1")
          toast.success("Secondary Contact Changed");
      })
      .catch((err) => console.log(err));
  };

  const changeAddress = async (e) => {
    e.preventDefault();
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
      .then((res) => {
        if (res.data.success === "1") toast.success("Address Changed");
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-9 col-xl-8 mx-xl-auto mx-lg-auto col-sm-11 offset-sm-1 mx-md-auto col-md-10 login px-5">
          <h2 className="section-title mx-0">My Profile</h2>

          <h4>Pesrsonal Details</h4>
          <label>Full name</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
          ></input>
          <button className="btn my-btn-primary my-2" onClick={changeName}>
            Change Name
          </button>
          <br />
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          ></input>
          <button className="btn my-btn-primary my-2" onClick={changeEmail}>
            Change Email
          </button>
          <br />
          <label>Contact</label>
          <br />
          <input
            type="number"
            value={contactOne}
            onChange={(e) => setContactOne(e.target.value)}
            className="form-control"
          ></input>
          <button className="btn my-btn-primary my-2" onClick={changeContact}>
            Change Contact
          </button>
          <br />
          <label>Secondary Contact (Optional)</label>
          <br />
          <input
            type="number"
            value={contactTwo}
            onChange={(e) => setContactTwo(e.target.value)}
            className="form-control"
          ></input>
          <button
            className="btn my-btn-primary my-2"
            onClick={changeSecondaryContact}
          >
            Change Secondary Contact
          </button>
          <br />
          <hr />
          <h4>Delivery Address</h4>
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

          <button
            className="btn my-btn-primary btn-block"
            onClick={changeAddress}
          >
            Change Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
