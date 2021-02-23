import { useState, useEffect } from "react";
import { getAllProducts } from "../functions/index";
import { useParams } from "react-router-dom";
import LoadingCard from "../components/cards/LoadingCard";
import ProductCard from "../components/cards/ProductCard";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { keyword } = useParams();

  useEffect(() => {
    const loadProducts = () => {
      setLoading(true);
      getAllProducts()
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
  }, []);

  return (
    <>
      <h2 className="section-title">Product List</h2>
      <div className="container-fluid">
        <div className="row section-row">
          {loading ? (
            <LoadingCard
              count={8}
              classValue="col-6 col-md-4 col-lg-3 p-1 product-card-wrapper"
            />
          ) : products.filter((item) =>  item.product_name.toLowerCase().includes(keyword.toLowerCase()))
              .length > 0 ? (
            products.length > 0 &&
            products
              .filter((item) =>
                item.product_name.toLowerCase().includes(keyword.toLowerCase())
              )
              .map((item, i) => (
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
          ) : (
            <div className="mb-5 pb-5">
              <h3 className="">No Products Found for {keyword}</h3>
              <br />
              <h4 className="">
                Try checking your spellings and use more general terms
              </h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
