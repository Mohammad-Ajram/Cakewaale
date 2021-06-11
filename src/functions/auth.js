import axios from "axios";

export const loginCustomer = async (email, password) =>
  await axios.post(`${process.env.REACT_APP_API}/login/customer`, {
    email,
    password,
  });

export const signupCustomer = async (
  name,
  email,
  password,
  contact_one,
  contact_two,
  houseNo,
  landmark,
  locality,
  city,
  state,
  pincode,
  referer_id
) =>
  await axios.post(`${process.env.REACT_APP_API}/api/customer/create`, {
    name,
    email,
    password,
    contact_one,
    contact_two,
    houseNo,
    landmark,
    locality,
    city,
    state,
    pincode,
    referer_id,
    delivery_houseNo: houseNo,
    delivery_landmark: landmark,
    delivery_locality: locality,
    delivery_city: city,
    delivery_state: state,
    delivery_pincode: pincode,
  });
