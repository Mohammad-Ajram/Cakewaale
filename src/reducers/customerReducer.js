const customerReducer = (state = null, action) => {
  switch (action.type) {
    case "LOG_IN_CUSTOMER":
      return action.payload;
    case "LOG_OUT_CUSTOMER":
      return action.payload;
    case "GET_CART":
      return action.payload;
    case "GET_WISHLIST":
      return action.payload;
    default:
      return state;
  }
};
export default customerReducer;
