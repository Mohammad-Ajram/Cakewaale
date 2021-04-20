const CheckoutProductCard = ({ product }) => {
  return (
    <div
      className="row checkout-product-card"
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <img
        src={product ? "https://cakewaale.com" + product.img : ""}
        alt="cake"
        style={{ width: "20%", height: "60px", objectFit: "contain" }}
      />
      <label className="c-p-card-label">
        <span>
          {product.product_name} <br /> ({product.weight} pounds)
        </span>
      </label>
      <label className="c-p-card-label">
        {" "}
        &nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;&nbsp;{
          product.quantity
        } = <b>₹{product.total_price}</b>
      </label>
    </div>
  );
};

export default CheckoutProductCard;
