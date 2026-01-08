import styles from "./EmptyWishlist.module.scss";
import arrowImg from "../../assets/Vector.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/buttons/Button";
import WishlistCards from "../../components/WishlistCards/WishlistCards";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";

import { getMyWishlists } from "../../api"; 

const EmptyWishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlists, setWishlists] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlists = async () => {
      try {
        setLoading(true);
        const data = await getMyWishlists();
        setWishlists(data || []);
      } catch (error) {
        console.error("Ошибка при загрузке вишлистов:", error);
      } finally {
        setLoading(false);
      }
    };
    loadWishlists();
  }, []);

  const handleOpenWishlist = (id: string) => {
    navigate(`/wishlist/${id}`);
  };

  const handleCreateNew = () => {
    navigate("/create");
  };

  const isEmpty = !loading && wishlists.length === 0;

  return (
    <div>
      <Header />
      <section className={styles.wrapper}>
        <div className={styles.wishlistCardsContainer}>
          {loading ? (
            <p>Загрузка...</p>
          ) : isEmpty ? (
            <>
              <h1>Здесь пока пусто(</h1>
              <h1>Самое время начать!</h1>
              <img src={arrowImg} alt="arrow" className={styles.arrow} />
            </>
          ) : (
            /* Передаем список и функцию навигации */
            <WishlistCards 
              wishlists={wishlists} 
              onOpen={handleOpenWishlist} 
            />
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