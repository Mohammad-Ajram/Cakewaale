import CategoryCard from "../cards/CaetgoryCard";
import { useState, useEffect } from "react";
import { getProfessionCategories } from "../../functions/index";
import LoadingCard from "../cards/LoadingCard";

const Profession = () => {
  const [categories, setcategories] = useState([]);
  const [limit, setLimit] = useState(
    window.screen.width > 992 ? 8 : window.screen.width > 400 ? 6 : 4
  );
  const [loading, setLoading] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    getProfessionCategories()
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
    else
      setLimit(
        window.screen.width > 992 ? 8 : window.screen.width > 400 ? 6 : 4
      );
  };
  return (
    <>
      <h2 className="section-title">Cakes By Profession</h2>
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
              classValue="col-6 col-md-4 col-lg-3 p-1"
            />
          ) : (
            categories.length > 0 &&
            categories
              .filter((item, i) => i < limit)
              .map((item) => (
                <div className="col-6 col-md-4 col-lg-3 p-1" key={item.name}>
                  <CategoryCard name={item.name} img={item.prof_img} />
                </div>
              ))
          )}
        </div>
        <span className="float-right view-more pointer" onClick={viewAll}>
          {limit === categories.length ? "View less" : "View More"}
        </span>
      </div>
    </>
  );
};

export default Profession;
