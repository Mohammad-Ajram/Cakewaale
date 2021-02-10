import WishlistProductCard from "../../components/cards/WishlistProductCard";
import { getWishlist } from "../../functions/customer";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EmptyWishlist from "../../images/empty-wishlist.png";
import { useDispatch } from "react-redux";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const { customer } = useSelector((state) => ({ ...state }));

  const dispatch = useDispatch();

  const loadWishlist = () => {
    getWishlist(customer.token)
      .then((res) => {
        if (res.data.success === "1") setWishlist(res.data.fav_items);
        else setWishlist([]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const loadWishlists = () => {
      getWishlist(customer.token)
        .then((res) => {
          if (res.data.success === "1") {
            setWishlist(res.data.fav_items);

            dispatch({
              type: "GET_WISHLIST",
              payload: { ...customer, wishlist: res.data.fav_items },
            });
          } else {
            setWishlist([]);
            dispatch({
              type: "GET_WISHLIST",
              payload: { ...customer, wishlist: undefined },
            });
          }
        })
        .catch((err) => console.log(err));
    };
    loadWishlists();
  }, []);

  return (
    <>
      <h2 className="section-title"> My Wishlist ({wishlist.length} items)</h2>
      {wishlist.length === 0 && (
        <>
          <div className="empty-wishlist-image">
            <img
              src={EmptyWishlist}
              alt="Empty Cart"
              style={{ width: "100%", height: "200px", objectFit: "contain" }}
            />
          </div>
          <h4 className="text-center">Your Wishlist is empty</h4>
        </>
      )}
      {wishlist.length > 0 && (
        <div className="container-fluid">
          <div className="row">
            {wishlist.length > 0 &&
              wishlist.map((item) => (
                <WishlistProductCard
                  loadWishlist={loadWishlist}
                  product={item}
                  key={item.product_id}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};
export default Wishlist;
