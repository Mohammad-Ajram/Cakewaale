import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About</h6>
            <p className="text-justify">
              www.cakewaale.com is an online platform that delivers cakes &
              gifts for all occasions. Founded in Dehradun, we at CakeWaale
              deliver the best quality - fresh & hygienic cakes. We believe
              there is a better way to serve you. A more valuable,less invasive
              where customers are earned rather than bought. We provide the best
              online cake delivery service to our customers. Our service is fast
              as well as reliable. We at CakeWaale know how important it is to
              express your feelings with the same amount of zeal that your
              presence would have brought to the occasion, when it comes to
              bring smile on the face of your beloved ones.
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
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">
              Copyright &copy; 2021 All Rights Reserved by
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
  );
};

export default Footer;
