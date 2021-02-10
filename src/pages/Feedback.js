import { giveFeedback } from "../functions/customer";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Feedback = ({ history }) => {
  const [description, setDescription] = useState("");

  const { customer } = useSelector((state) => ({ ...state }));

  const placeholder =
    "Please share your feedback! We would love to hear from you and we will try hard to work on your feedback.";
  const submitFeedback = (e) => {
    e.preventDefault();
    giveFeedback(description, customer.token)
      .then((res) => {
        if (res.data.success === "1") {
          toast.success("Thanks for giving feedback!");
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container-fluid feedback">
      <div className="row">
        <div className="col-md-6 offset-md-3 mt-5">
          <h3>Feedback</h3>
          <form onSubmit={submitFeedback}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              placeholder={placeholder}
              style={{ resize: "none", height: "150px" }}
            ></textarea>
            <br />
            <button className="btn my-btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Feedback;
