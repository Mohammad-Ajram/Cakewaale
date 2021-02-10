import { useState, useEffect } from "react";
import { getAbout } from "../functions/index";

const About = () => {
  const [about, setAbout] = useState();

  useEffect(() => {
    getAbout()
      .then((res) => {
        if (res.data.success) setAbout(res.data.message);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      className="container pt-3 pl-3 pr-3 mt-3 about"
      style={{ height: "100vh", backgroundColor: "white" }}
    >
      <h1 className="mt-3 mx-3">About Us</h1>
      <hr />
      <p className="mx-4" id="about-content">
        {about}
      </p>
    </div>
  );
};

export default About;
