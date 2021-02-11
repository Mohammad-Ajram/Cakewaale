import { useState } from "react";
import Logo from "../../images/logo.png";
import { Drawer } from "antd";
import { useHistory } from "react-router-dom";
import Cart from "../../images/icons/shopping-cart.svg";
import Heart from "../../images/icons/heart.svg";
import User from "../../images/icons/user.svg";
import Menu from "../../images/icons/menu.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Topnav = () => {
  const [visible, setVisible] = useState(false);
  const [keyword, setKeyword] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();

  const { customer } = useSelector((state) => ({ ...state }));

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
          <i className="material-icons search-icon">search</i>
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
                  <strong>Hello {customer.name}</strong>
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
            <strong>Hello {customer.name}</strong>
          </h6>
        )}
        <hr />
        <ul className="menu-list">
          {!customer && (
            <Link to="/login" onClick={() => setVisible(false)}>
              <li className="sidebar-link">Login / Signup</li>
            </Link>
          )}
          <Link to="/" onClick={() => setVisible(false)}>
            <li className="sidebar-link">Home</li>
          </Link>
          <Link to="/about" onClick={() => setVisible(false)}>
            {" "}
            <li className="sidebar-link">About</li>
          </Link>
          <Link to="/privacy-policy" onClick={() => setVisible(false)}>
            {" "}
            <li className="sidebar-link">Privacy Policy</li>
          </Link>

          <li>
            {customer && customer.token && (
              <>
                <Link to="user/profile" onClick={() => setVisible(false)}>
                  <li className="sidebar-link">My Profile</li>
                </Link>
                <Link
                  to="user/ongoing-orders"
                  onClick={() => setVisible(false)}
                >
                  <li className="sidebar-link">Ongoing orders</li>
                </Link>
                <Link
                  to="user/previous-orders"
                  onClick={() => setVisible(false)}
                >
                  <li className="sidebar-link">Previous orders</li>
                </Link>
                <Link to="user/wishlist" onClick={() => setVisible(false)}>
                  <li className="sidebar-link">Wishlist</li>
                </Link>
                {/* <Link to="/contact-us" onClick={() => setVisible(false)}>
                  <li className="sidebar-link">Contact us</li>
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="btn my-btn-primary btn-block"
                >
                  Logout
                </button>
              </>
            )}
          </li>
        </ul>
      </Drawer>
    </>
  );
};

export default Topnav;
