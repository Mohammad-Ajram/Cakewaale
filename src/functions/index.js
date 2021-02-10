import axios from "axios";

export const getAbout = async () =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/about`);

export const getPrivacyPolicy = async () =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/privacy_policy`);

export const getFaq = async () =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/faq`);

export const getCategories = async () =>
  await axios.get(`${process.env.REACT_APP_API}/category?city=dehradun`);

export const getProfessionCategories = async () =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/profession?city=dehradun`
  );

export const getCakesByOffer = async () =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/items?city=dehradun&category_name=offer`
  );

export const getFlavours = async () =>
  await axios.get(`${process.env.REACT_APP_API}/flavour?city=dehradun`);

export const getCakesByFlavour = async (flavour) =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/items?city=dehradun&flavour=${flavour}`
  );

export const getDesignerCakes = async () =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/items?city=dehradun&category_name=designer`
  );

export const getPhotoCakes = async () =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/items?city=dehradun&category_name=photocake`
  );

export const getProductsByCategory = async (name) =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/items?city=dehradun&category_name=${name}`
  );

export const getIndividualProduct = async (id) =>
  await axios.get(`${process.env.REACT_APP_API}/product/item?product_id=${id}`);

export const getAllProducts = async () =>
  await axios.get(
    `${process.env.REACT_APP_API}/category/items?city=dehradun&category_name=all`
  );
