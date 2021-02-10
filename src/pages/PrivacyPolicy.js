import { useEffect, useState } from "react";
import { getPrivacyPolicy } from "../functions/index";

const PrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);

  useEffect(() => {
    getPrivacyPolicy()
      .then((res) => {
        if (res.data.success) setPrivacyPolicy(res.data.message);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container privacy-policy">
      <h1 className="text-center mt-2">Privacy Policy</h1>

      {privacyPolicy.map((item, i) => (
        <div key={i}>
          {" "}
          <h5>{item.title}</h5>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
