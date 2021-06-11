import "../index.css";
import Lcover from "../images/lcover.jpeg";
import Scover from "../images/scover.jpeg";
import Ocassion from "../components/home/Ocassion";
import Profession from "../components/home/Profession";
import Offer from "../components/home/Offer";
import Flavour from "../components/home/Flavour";
import Designer from "../components/home/Designer";
import Photo from "../components/home/Photo";
import { Modal } from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { Avatar } from "antd";
import { getProfile, incVisCount } from "../functions/customer";
import scriptLoader from "react-async-script-loader";

const Home = ({ history }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState("");
  const [hNo, setHNo] = useState("");
  const [locality, setLocality] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const token = query.get("id");

    if (token) {
      if (!window.localStorage.getItem("id")) {
        incVisCount(token)
          .then((res) => {
            if (res.data.success === "1")
              window.localStorage.setItem("id", token);
          })
          .catch((err) => console.log(err));
      }
    }
  }, []);

  useEffect(() => {
    if (customer && customer.token) {
      getProfile(customer.token).then((res) => {
        setHNo(res.data.customer_detail.delivery_houseNo);
        setLocality(res.data.customer_detail.delivery_locality);
        setLandmark(res.data.customer_detail.delivery_landmark);
        setPincode(res.data.customer_detail.delivery_pincode);
      });
    }
  }, []);

  const showModal = () => {
    if (!customer) history.push("/login");
    else setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const placeholder =
    "Please share your cake description in details, also upload the picture of what kind of cake you want.\nNote : You can search for cake on google and we will make it for you.";

  const placeCustomisedOrder = (e) => {
    e.preventDefault();
    if (files.length > 5) toast.error(`You must only select upto 5 images.`);
    else if (files.length === 0)
      toast.error("Please upload atleast one photo.");
    else if (!hNo || !locality || !landmark || !pincode) {
      toast.error("Please add your delivery address first.");
      history.push("/user/profile");
    } else {
      let fd = new FormData();
      for (let i = 0; i < files.length; i++) {
        fd.append("file", files[i]);
      }
      fd.append("description", description);
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API}/api/customer/upload/customised_cake/order`,
        data: fd,
        headers: {
          "Content-Type": "multipart/form-data",
          "x-customer-token": customer.token,
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.success === "1") {
            toast.success("Customised order placed successfully!");
            setDescription("");
            setFiles("");
            setIsModalVisible(false);
          } else toast.error("Error uploading images, please try again!");
        })
        .catch((err) => console.log(err));
    }
  };

  const showAvatars = () => {
    let arr = [];
    for (let i = 0; i < files.length; i++) {
      arr.push(
        <Avatar size={100} src={URL.createObjectURL(files[i])} key={i}></Avatar>
      );
    }
    return arr;
  };

  return (
    <>
      {/* <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Enter Address...",
              })}
            />
            <div>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const style = suggestion.active
                  ? { backgroundColor: "#a83232", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })}>
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete> */}

      <Modal
        title="Customised Cake"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className="px-4 pb-4">
          <form onSubmit={placeCustomisedOrder}>
            <textarea
              value={description}
              className="form-control"
              style={{ resize: "none", height: "150px" }}
              placeholder={placeholder}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <br />
            {showAvatars()}
            <div className="row">
              <div className="col-12 mt-3">
                <label className="btn my-btn-primary btn-block">
                  Select Photos
                  <input
                    type="file"
                    accept="image/*"
                    encType="multipart/form-data"
                    multiple
                    hidden
                    onChange={(e) => setFiles(e.target.files)}
                  ></input>
                </label>
              </div>
            </div>
            <br />
            <button className="btn my-btn-primary btn-block">Submit</button>
          </form>
        </div>
      </Modal>
      <div className="cover container-fluid">
        {/* <h1 className="cover-title my-auto">
          Send personalised cakes to your loved ones!
          <br />
          <button className="btn  my-btn-primary pointer" onClick={showModal}>
            Order Customised Cake
          </button>
        </h1>
        <img src={AP} alt="allura_propasal" className="ap" />
        <img src={Cake} className="cake-image" alt="cake" /> */}
        <img
          src={Lcover}
          id="lcover"
          alt="cover"
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
        <img
          src={Scover}
          id="scover"
          alt="cover"
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
        <button
          className="btn  my-btn-primary pointer cta-btn"
          onClick={showModal}
        >
          ORDER CUSTOMIZED CAKE
        </button>
      </div>
      <div className="container-fluid section">
        <Ocassion />
      </div>
      <div className="container-fluid section">
        <Profession />
      </div>
      <div className="container-fluid section">
        <Offer />
      </div>
      <div className="container-fluid section">
        <Flavour />
      </div>
      <div className="container-fluid section">
        <Designer />
      </div>
      <div className="container-fluid section">
        <Photo />
      </div>
    </>
  );
};

export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=places`,
])(Home);
