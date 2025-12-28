import AddWishModal from "../../components/AddWishModal/AddWishModal";
import WishlistActions from "../../components/createWishlists/WishlistActions";
import WishlistContent from "../../components/WishlistContent/WishlistContent";
import Button from "../../components/UI/buttons/Button";
import styles from "./WishlistView.module.scss";
import React, { useEffect, useState, useCallback } from "react";
import {Footer} from "../../components/Footer/Footer";
import {Header} from "../../components/Header/Header";
import {
  getCurrentWishlist,
  updateWishlist,
  Wishlist,
} from "../../services/wishlistStorage";

const WishlistView = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    const stored = getCurrentWishlist();
    if (stored) setWishlist(stored);
  }, []);

  const persistWishlist = useCallback((updatedWishlist: Wishlist) => {
    setWishlist(updatedWishlist);
    updateWishlist(updatedWishlist);
  }, []);

  const handleAddWish = useCallback((wish: {
    name: string;
    link: string;
    image: string;
    price: string;
  }) => {
    if (!wishlist) return;
    const updated = {
      ...wishlist,
      items: [...wishlist.items, { id: Date.now(), ...wish }],
    };
    persistWishlist(updated);
    setIsModalOpen(false);
  }, [wishlist, persistWishlist]);

  const handleDeleteWish = useCallback((id: number) => {
    if (!wishlist) return;
    const updated = {
      ...wishlist,
      items: wishlist.items.filter((i) => i.id !== id),
    };
    persistWishlist(updated);
  }, [wishlist, persistWishlist]);

  if (!wishlist) return <p>Вишлист не найден</p>;

  return (
      <div>
          <Header />
            <div className={styles.container}>
              <div className={styles.card}>
                <WishlistContent
                  wishlist={wishlist}
                  mode="owner"
                  isDeleteMode={isDeleteMode}
                  onDeleteWish={handleDeleteWish}
                />

                {isDeleteMode ? (
                  <Button
                    onClick={() => setIsDeleteMode(false)}
                  >
                    Вернуться
                  </Button>
                ) : (
                  <WishlistActions
                    onAddWish={() => setIsModalOpen(true)}
                    onDeleteMode={() => setIsDeleteMode(true)}
                  />
                )}
              </div>

              {isModalOpen && (
                <AddWishModal
                  onClose={() => setIsModalOpen(false)}
                  onAdd={handleAddWish}
                />
              )}
            </div>
          <Footer />
      </div>
  );
};

export default WishlistView;
