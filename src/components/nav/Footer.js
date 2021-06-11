import { Link } from "react-router-dom";
import { Modal } from "antd";
import { useState } from "react";
import { makeBDev, getProfile, makeBDevPass } from "../../functions/customer";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const Footer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setIsPasswordModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsPasswordModalVisible(false);
  };

  const showPasswordModal = () => {
    setPassword("");
    setIsPasswordModalVisible(true);
  };

  const makeBusinessDev = () => {
    setIsModalVisible(false);
    getProfile(customer.token)
      .then((response) => {
        console.log(response.data);
        if (response.data.success === "1") {
          if (response.data.customer_detail.bdev_check)
            toast.success("You are already a business developer.");
          else {
            makeBDev(response.data.customer_detail.customer_id)
              .then((res) => {
                if (res.data.success === "1")
                  toast.success(
                    "Congratulations! You are now a business developer"
                  );
                else if (res.data.success === "2") showPasswordModal();
                else toast.error("Some error occured");
              })
              .catch((err) => console.log(err));
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const setPass = () => {
    if (password !== password2) {
      toast.error("Password mismatch!");
    } else {
      setIsPasswordModalVisible(false);
      getProfile(customer.token)
        .then((response) => {
          if (response.data.success === "1") {
            makeBDevPass(response.data.customer_detail.customer_id, password)
              .then((res) => {
                if (res.data.success === "1")
                  toast.success(
                    "Congratulations! You are now a business developer"
                  );
                else toast.error("Some error occured");
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <Modal
        title="Become a business developer"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className="container">
          <br />
          <ul>
            <li>Refer once</li>
            <li>Earn on every purchase from your referred user</li>
            <li>Generate your passive income</li>
          </ul>
          <button
            className="btn my-btn-primary btn-block"
            onClick={makeBusinessDev}
          >
            Become a business developer
          </button>
          <br />
        </div>
      </Modal>
      <Modal
        title="Set up your password"
        visible={isPasswordModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <div className="container">
          <br />
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <br />
          <button
            className="btn my-btn-primary btn-block"
            onClick={setPass}
            disabled={!password}
          >
            Set Password
          </button>
          <br />
        </div>
      </Modal>
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <h6>About</h6>
              <p className="text-justify">
                www.cakewaale.com is an online platform that delivers cakes &
                gifts for all occasions. Founded in Dehradun, we at CakeWaale
                deliver the best quality - fresh & hygienic cakes. We believe
                there is a better way to serve you. A more valuable,less
                invasive where customers are earned rather than bought. We
                provide the best online cake delivery service to our customers.
                Our service is fast as well as reliable. We at CakeWaale know
                how important it is to express your feelings with the same
                amount of zeal that your presence would have brought to the
                occasion, when it comes to bring smile on the face of your
                beloved ones.
              </p>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Popular Categories</h6>
              <ul className="footer-links">
                <Link to="/product-list/Birthday">
                  <li>Birthday</li>
                </Link>
                <Link to="/product-list/Wedding%20&%20Anniversary">
                  {" "}
                  <li>Wedding & Anniversary</li>
                </Link>
                <Link to="/product-list/Fathers%20Day">
                  {" "}
                  <li>Father's Day</li>
                </Link>
                <Link to="/product-list/designer">
                  {" "}
                  <li>Designer</li>
                </Link>
                <Link to="/product-list/Valentine">
                  {" "}
                  <li>Valentine</li>
                </Link>
                <Link to="/product-list/Mothers%20Day">
                  {" "}
                  <li>Mother's Day</li>
                </Link>
              </ul>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Quick Links</h6>
              <ul className="footer-links">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                {/* <li>
                <Link to="/contact">Contact Us</Link>
              </li> */}
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/feedback">Give Feedback</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ's</Link>
                </li>
                {customer && customer.token && (
                  <li className="pointer">
                    <span onClick={showModal}>Become a business developer</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <hr />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-sm-6 col-xs-12">
              <p className="copyright-text">
                Copyright &copy; {new Date().getFullYear()} All Rights Reserved
                by
                <Link to="/"> Cakewaale.com</Link>.
              </p>
            </div>

            <div className="col-md-4 col-sm-6 col-xs-12">
              <ul className="social-icons">
                <li>
                  <a
                    className="facebook"
                    target="/"
                    href="https://www.facebook.com/cakewaale/"
                  >
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>

                <li>
                  <a
                    className="instagram"
                    target="/"
                    href="https://www.instagram.com/cakewaale/?hl=en"
                  >
                    <i className="fa fa-instagram"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
