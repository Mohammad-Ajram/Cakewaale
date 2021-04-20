import { useEffect, useState } from "react";
import { getFlavours, getCakesByFlavour } from "../../functions/index";
import ProductCard from "../cards/ProductCard";
import LoadingCard from "../cards/LoadingCard";

const Flavour = () => {
  const [flavours, setFlavours] = useState([]);
  const [flavour, setFlavour] = useState("chocolate");
  const [products, setProducts] = useState([45]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(
    window.screen.width > 992 ? 8 : window.screen.width > 400 ? 6 : 4
  );

  const loadProducts = (f) => {
    setLoading(true);
    getCakesByFlavour(f)
      .then((res) => {
        setLoading(false);
        if (res.data.success === "1") setProducts(res.data.Products);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const loadFlavours = () => {
    setLoading(true);
    getFlavours()
      .then((res) => {
        setLoading(false);
        if (res.data.success === "1") setFlavours(res.data.All_Flavours);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    loadFlavours();
    loadProducts("chocolate");
  }, []);

  const changeFlavour = (e) => {
    setFlavour(e.target.value);
    loadProducts(e.target.value);
  };
  const viewAll = () => {
    if (limit !== products.length) setLimit(products.length);
    else
      setLimit(
        window.screen.width > 992 ? 8 : window.screen.width > 400 ? 6 : 4
      );
  };
  return (
    <>
      <h2 className="section-title mb-0">Cakes By Flavour</h2>
      <br />
      <label id="label-for-flavour" className="">
        Choose Flavour
      </label>
      <select
        value={flavour}
        onChange={changeFlavour}
        className="form-control col-md-4 col-sm-10 flavour-select"
      >
        {flavours.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>
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
        <span className="float-right view-more pointer" onClick={viewAll}>
          {limit === products.length ? "View less" : "View More"}
        </span>
      </div>
    </>
  );
};

export default Flavour;
