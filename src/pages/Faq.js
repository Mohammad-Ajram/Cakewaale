import { useEffect, useState } from "react";
import { getFaq } from "../functions/index";

const Faq = () => {
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    getFaq()
      .then((res) => {
        if (res.data.success) setFaq(res.data.message);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container mt-4">
      <h1 className="mt-2">Frequently asked questions</h1>
      <hr />
      <br />
      {faq.map((item, i) => (
        <div key={i}>
          {" "}
          <h5>
            <strong>{item.title}</strong>
          </h5>
          <p>{item.description}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Faq;
