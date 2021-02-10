import Cake from "../images/cake.png";
import "../index.css";
import AP from "../images/Allura Proposal.png";
import Ocassion from "../components/home/Ocassion";
import Profession from "../components/home/Profession";
import Offer from "../components/home/Offer";
import Flavour from "../components/home/Flavour";
import Designer from "../components/home/Designer";
import Photo from "../components/home/Photo";
import { Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";

const Home = ({ history }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

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
    "Please share your cake description in details! We would love to hear from you and we will try hard to work on your cake requirement.";

  const placeCustomisedOrder = (e) => {
    e.preventDefault();
    if (files.length > 5) toast.error(`You must only select upto 5 images.`);
    else if (files.length === 0)
      toast.error("Please upload atleast one photo.");
    else {
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

  return (
    <>
      <Modal
        title="Customised Cake"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <form onSubmit={placeCustomisedOrder}>
          <textarea
            value={description}
            className="form-control"
            style={{ resize: "none", height: "150px" }}
            placeholder={placeholder}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <br />
          <div className="row">
            <div className="col-12 mt-3">
              <label className="btn my-btn-primary btn-block">
                Upload photo
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
      </Modal>
      <div className="cover container-fluid">
        <h1 className="cover-title my-auto">
          Send personalised cakes to your loved ones!
          <br />
          <button className="btn  my-btn-primary" onClick={showModal}>
            Order Customised Cake
          </button>
        </h1>
        <img src={AP} alt="allura_propasal" className="ap" />
        <img src={Cake} className="cake-image" alt="cake" />
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

export default Home;
