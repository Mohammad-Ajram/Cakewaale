import axios from "axios";

export const getProfile = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/profile`, {
    headers: {
      "x-customer-token": token,
    },
  });

export const giveFeedback = async (description, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/api/customer/feedback`,
    {
      description,
    },
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const addToCart = async (
  product_id,
  flavour,
  weight,
  total_price,
  token
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/api/customer/order/cart/add`,
    {
      product_id,
      flavour,
      weight,
      total_price,
    },
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const getCartDetails = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/order/cart`, {
    headers: {
      "x-customer-token": token,
    },
  });

export const removeCartItem = async (id, token) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/api/customer/order/cart/remove?product_id=${id}`,
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const getWishlist = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/favourites`, {
    headers: {
      "x-customer-token": token,
    },
  });

export const addToWishlist = async (product_id, weight, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/api/customer/favourites/add`,
    {
      product_id,
      weight,
    },
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const removeWishlistItem = async (id, token) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/api/customer/favourites/remove?product_id=${id}`,
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const increaseQuantity = async (id, total, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/increase?product_id=${id}&total_price=${total}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const decreaseQuantity = async (id, total, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/decrease?product_id=${id}&total_price=${total}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const changeFlavour = async (id, total, flavour, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/increase?product_id=${id}&total_price=${total}&flavour=${flavour}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );
export const changeWeight = async (id, total, weight, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/decrease?product_id=${id}&total_price=${total}&weight=${weight}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );
export const changeCakeType = async (id, total, caketype, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/increase?product_id=${id}&total_price=${total}&cake_type=${caketype}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const changeName = async (id, total, name, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/decrease?product_id=${id}&total_price=${total}&name=${name}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );
export const changeSuggestion = async (id, total, suggestion, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/api/customer/order/cart/decrease?product_id=${id}&total_price=${total}&suggestion=${suggestion}`,
    {},
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );
export const placeOrder = async (
  delivery_date,
  payment_method,
  range,
  promo,
  token
) =>
  await axios.post(
    `${process.env.REACT_APP_API}/api/customer/order/new`,
    {
      delivery_date,
      payment_method,
      range: String(range),
      promo: String(promo),
    },
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );
export const getOngoingOrders = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/order/ongoing`, {
    headers: {
      "x-customer-token": token,
    },
  });
export const getPreviousOrders = async (token) =>
  await axios.get(`${process.env.REACT_APP_API}/api/customer/order/previous`, {
    headers: {
      "x-customer-token": token,
    },
  });
export const cancelOrder = async (order_id, token) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/api/customer/order/ongoing/cancel?order_id=${order_id}`,
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );

export const checkPromo = async (code, token) =>
  await axios.get(
    `${process.env.REACT_APP_API}/api/customer/promo/check?code=${code}`,
    {
      headers: {
        "x-customer-token": token,
      },
    }
  );
