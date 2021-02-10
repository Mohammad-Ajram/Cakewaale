import CategoryCard from "../cards/CaetgoryCard";
import { useState, useEffect } from "react";
import { getCategories } from "../../functions/index";
import LoadingCard from "../cards/LoadingCard";

const Ocassion = () => {
  const [categories, setcategories] = useState([]);
  const [limit, setLimit] = useState(6);
  const [loading, setLoading] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setLoading(false);
        if (res.data.success === "1") setcategories(res.data.All_Category);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  useEffect(() => {
    loadCategories();
  }, []);

  const viewAll = () => {
    if (limit !== categories.length) setLimit(categories.length);
    else setLimit(6);
  };
  return (
    <>
      <h2 className="section-title">Cakes By Ocassion</h2>
      <div className="container-fluid">
        <div className="row section-row">
          {!loading ? (
            categories.length > 0 &&
            categories
              .filter((item, i) => i < limit)
              .map((item) => (
                <div className="col-6 col-md-4 col-lg-3 p-1" key={item.name}>
                  <CategoryCard name={item.name} img={item.prof_img} />
                </div>
              ))
          ) : (
            <LoadingCard count={6} classValue="col-6 col-md-4 col-lg-3 p-1" />
          )}
        </div>
        <span className="float-right view-more pointer" onClick={viewAll}>
          {limit === categories.length ? "View less" : "View More"}
        </span>
      </div>
    </>
  );
};

export default Ocassion;
