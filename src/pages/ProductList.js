import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductsByCategory } from "../functions/index";
import ProductCard from "../components/cards/ProductCard";
import LoadingCard from "../components/cards/LoadingCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  let { slug } = useParams();
  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      getProductsByCategory(
        slug === "Wedding & Anniversary" || slug === "Wedding & Anniversary "
          ? "Wedding%20%26%20Anniversary%20"
          : slug
      )
        .then((res) => {
          setLoading(false);
          if (res.data.success === "1") setProducts(res.data.Products);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    };
    loadProducts();
  }, [slug]);

  return (
    <>
      <h2 className="section-title">Cakes List</h2>
      <div className="container-fluid">
        <div className="row section-row">
          {loading ? (
            <LoadingCard
              count={8}
              classValue="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
            />
          ) : (
            products.length > 0 &&
            products.map((item, i) => (
              <div
                className="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
                key={i}
              >
                <ProductCard
                  id={item.product_id}
                  name={item.product_name}
                  img={item.prof_img}
                  discountedPrice={item.discounted_price}
                  discount={item.offer}
                  price={item.price}
                  weight={item.weight}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
