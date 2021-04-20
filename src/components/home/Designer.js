import ProductCard from "../cards/ProductCard";
import { useState, useEffect } from "react";
import { getDesignerCakes } from "../../functions/index";
import LoadingCard from "../cards/LoadingCard";

const Designer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(
    window.screen.width > 992 ? 8 : window.screen.width > 400 ? 6 : 4
  );

  const loadProducts = () => {
    setLoading(true);
    getDesignerCakes()
      .then((res) => {
        setLoading(false);
        if (res.data.success === "1") setProducts(res.data.Products);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    loadProducts();
  }, []);

  const viewAll = () => {
    if (limit !== products.length) setLimit(products.length);
    else
      setLimit(
        window.screen.width > 992 ? 8 : window.screen.width > 400 ? 6 : 4
      );
  };

  return (
    <>
      <h2 className="section-title">Designer Cakes</h2>
      <div className="container-fluid">
        <div className="row section-row">
          {loading ? (
            <LoadingCard
              count={
                window.screen.width > 992
                  ? 8
                  : window.screen.width > 400
                  ? 6
                  : 4
              }
              classValue="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
            />
          ) : (
            products.length > 0 &&
            products
              .filter((item, i) => i < limit)
              .map((item, i) => (
                <div
                  className="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
                  key={i}
                >
                  <ProductCard
                    name={item.product_name}
                    img={item.prof_img}
                    id={item.product_id}
                    discountedPrice={item.discounted_price}
                    discount={item.offer}
                    price={item.price}
                    weight={item.weight}
                  />
                </div>
              ))
          )}
        </div>
        <span className="float-right view-more pointer" onClick={viewAll}>
          {limit === products.length ? "View less" : "View More"}
        </span>
      </div>
    </>
  );
};

export default Designer;
