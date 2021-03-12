import { getPromocodes } from "../functions/index";
import { useState, useEffect } from "react";

const Promocode = () => {
  const [promocodes, setPromocodes] = useState([]);
  useEffect(() => {
    getPromocodes()
      .then((res) => {
        if (res.data.success === "1") setPromocodes(res.data.promos);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <h2 className="section-title">Promocodes</h2>
      <ul className="promo-list">
        {promocodes.map((item) => (
          <li key={item.code} className="promo-li-item">
            <span className="code">{item.code}</span> - {item.discount}% Off
          </li>
        ))}
      </ul>
    </>
  );
};

export default Promocode;
