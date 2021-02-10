import { useHistory } from "react-router-dom";

const CategoryCard = ({ name, img }) => {
  const history = useHistory();
  const goToProductList = () => {
    if (name === "Lawyer/Advocate")
      history.push(`/product-list/Lawyer%2FAdvocate`);
    else history.push(`/product-list/${name}`);
  };
  return (
    <>
      <div className="product-card pointer" onClick={goToProductList}>
        <div className="product-image">
          {img && (
            <img
              src={"https://cakewaale.com" + img}
              alt="cake"
              className="category-card-image"
            />
          )}
        </div>
      </div>
      <div className="product-info">
        <h4 className="text-center category-title">{name}</h4>
      </div>
    </>
  );
};

export default CategoryCard;
