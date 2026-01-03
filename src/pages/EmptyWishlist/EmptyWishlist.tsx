import styles from "./EmptyWishlist.module.scss";
import arrowImg from "../../assets/Vector.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/buttons/Button";
import WishlistCards from "../../components/WishlistCards/WishlistCards";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import {
  getAllWishlists,
  saveCurrentWishlist,
  Wishlist,
} from "../../services/wishlistStorage";

const EmptyWishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  useEffect(() => {
    const all = getAllWishlists();
    setWishlists(all);
  }, []);

  const handleOpenWishlist = (wishlist: Wishlist) => {
    saveCurrentWishlist(wishlist);
    navigate("/wishlist");
  };

  const handleCreateNew = () => {
    navigate("/create");
  };

  const isEmpty = wishlists.length === 0;

  return (
    <div>
      <Header />
      <section className={styles.wrapper}>
          <div className={styles.wishlistCardsContainer}>
        {isEmpty ? (
          <>
            <h1>Здесь пока пусто(</h1>
            <h1>Самое время начать!</h1>
            <img src={arrowImg} alt="arrow" className={styles.arrow} />
          </>
        ) : (

          <WishlistCards wishlists={wishlists} onOpen={handleOpenWishlist} />
        )}

        <Button
          type="button"
          className={styles.addButton}
          onClick={handleCreateNew}
        >
          Новый вишлист +
        </Button>
            </div>
      </section>
      <Footer />
    </div>
  );
};

export default EmptyWishlist;