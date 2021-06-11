import { useState } from "react";
import Logo from "../../images/logo.svg";
import { Drawer } from "antd";
import { useHistory } from "react-router-dom";
import Cart from "../../images/icons/shopping-cart.svg";
import Heart from "../../images/icons/heart.svg";
import User from "../../images/icons/user.svg";
import Menu from "../../images/icons/menu.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { makeBDev, getProfile, makeBDevPass } from "../../functions/customer";
import { toast } from "react-toastify";

const Topnav = () => {
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

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

  const handleLogout = () => {
    dispatch({
      type: "LOG_OUT_CUSTOMER",
      payload: null,
    });
    setVisible(false);
    history.push("/login");
  };

  const hideDropDown = () => {
    document.getElementById("d-content").style.display = "none";
  };

  const showDropdown = () => {
    document.getElementById("d-content").style.display = "block";
  };

  const search = (e) => {
    e.preventDefault();
    history.push("/search/" + keyword);
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
      <div className="topnav" id="myTopnav">
        <span className="icon pointer" onClick={() => setVisible(true)}>
          <img src={Menu} height="24px" width="24px" alt="menu-icon" />
        </span>
        <img
          src={Logo}
          alt="logo"
          className="logo pointer"
          onClick={() => history.push("/")}
        />

        <div className="search">
          <div className="s-icon-bg pointer" onClick={search}></div>
          <i className="material-icons search-icon pointer" onClick={search}>
            search
          </i>
          <form onSubmit={search} className="search-bar">
            {" "}
            <input
              type="text"
              placeholder="Search for cakes"
              className="search-input"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>

        <div
          className="dropdown"
          onMouseEnter={showDropdown}
          onMouseLeave={hideDropDown}
        >
          <button className="dropbtn">
            <img src={User} alt="cart-icon" />
            <br />
            <span className="icon-title">Profile</span>
          </button>
          <div
            className="dropdown-content"
            id="d-content"
            onClick={hideDropDown}
          >
            {customer && customer.token && (
              <>
                <h6
                  className="text-center"
                  style={{
                    padding: "10px 10px 0px 10px",
                    fontSize: "14px",
                    color: "#cb202d",
                  }}
                >
                  <strong>
                    <i className="fa fa-user"></i>&nbsp;Hello {customer.name}
                  </strong>
                </h6>
                <hr style={{ margin: "10px 0 0 0" }} />
                <button
                  className="drop-item-btn btn-block ml-0 item"
                  style={{ color: "#cb202d" }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
            {!customer && (
              <Link className="btn-block ml-0 item" to="/login">
                Login
              </Link>
            )}
            {customer && customer.token && (
              <>
                <Link className="btn-block ml-0 item" to="/user/profile">
                  My Profile
                </Link>

                <Link className="btn-block ml-0 item" to="/user/ongoing-orders">
                  Ongoing Orders
                </Link>
                <Link
                  className="btn-block ml-0 item"
                  to="/user/previous-orders"
                >
                  Previous Orders
                </Link>
                <Link className="btn-block ml-0 item" to="/promocode">
                  Promocodes
                </Link>
              </>
            )}
          </div>
        </div>

        <Link to="/user/wishlist">
          <img src={Heart} alt="cart-icon" />
          <br />
          <span className="icon-title">Wishlist</span>
        </Link>
        <Link to="/user/cart" style={{ position: "relative" }}>
          <img src={Cart} alt="cart-icon" />
          {customer && customer.cartItems && (
            <span
              className="badge badge-danger"
              style={{ position: "absolute", top: "2px", right: "1px" }}
            >
              {customer.cartItems.length}
            </span>
          )}

          <br />
          <span className="icon-title">Cart</span>
        </Link>
      </div>
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        key="left"
      >
        <h6 className="menu-title">
          {" "}
          <img src={Logo} width="40px" height="40px" alt="logo" /> Cakewaale
        </h6>
        {customer && customer.token && (
          <h6 className="text-center">
            <i className="fa fa-user" style={{ color: "grey" }}></i>
            &nbsp;
            <strong>Hello {customer.name}</strong>
          </h6>
        )}
        <hr />
        <ul className="menu-list">
          {!customer && (
            <li className="sidebar-link">
              <Link
                style={{ color: "black" }}
                to="/login"
                onClick={() => setVisible(false)}
              >
                Login / Signup
              </Link>
            </li>
          )}
          <li className="sidebar-link">
            <Link
              style={{ color: "black" }}
              to="/"
              onClick={() => setVisible(false)}
            >
              Home
            </Link>
          </li>
          {customer && customer.token && (
            <>
              <Link to="/user/profile" onClick={() => setVisible(false)}>
                <li className="sidebar-link">My Profile</li>
              </Link>
              <Link to="/user/ongoing-orders" onClick={() => setVisible(false)}>
                <li className="sidebar-link">Ongoing orders</li>
              </Link>
              <Link
                to="/user/previous-orders"
                onClick={() => setVisible(false)}
              >
                <li className="sidebar-link">Previous orders</li>
              </Link>
              <Link to="/user/wishlist" onClick={() => setVisible(false)}>
                <li className="sidebar-link">Wishlist</li>
              </Link>
              <Link to="/promocode" onClick={() => setVisible(false)}>
                <li className="sidebar-link">Promocodes</li>
              </Link>
              <Link to="/feedback" onClick={() => setVisible(false)}>
                <li className="sidebar-link">Feedback</li>
              </Link>
              <Link to="/faq" onClick={() => setVisible(false)}>
                <li className="sidebar-link">Faq</li>
              </Link>
              {/* <Link to="/contact-us" onClick={() => setVisible(false)}>
                  <li className="sidebar-link">Contact us</li>
                </Link> */}
            </>
          )}
          <li className="sidebar-link">
            <Link
              style={{ color: "black" }}
              to="/about"
              onClick={() => setVisible(false)}
            >
              {" "}
              About
            </Link>
          </li>{" "}
          <li className="sidebar-link">
            {" "}
            <Link
              style={{ color: "black" }}
              to="/privacy-policy"
              onClick={() => setVisible(false)}
            >
              Privacy Policy
            </Link>
          </li>
          {customer && customer.token && (
            <li className="sidebar-link">
              <span
                onClick={() => {
                  showModal();
                  setVisible(false);
                }}
              >
                Beecome a business developer
              </span>
            </li>
          )}
          {customer && customer.token && (
            <>
              <br />
              <br />
              <button
                className="btn my-btn-primary btn-block"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </ul>
      </Drawer>
    </>
  );
};

export default Topnav;
