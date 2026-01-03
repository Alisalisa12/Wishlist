import AddWishModal from "../../components/AddWishModal/AddWishModal";
import EditWishModal from "../../components/AddWishModal/EditWishModal";
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
  deleteWishlist,
  Wishlist,
} from "../../services/wishlistStorage";

const WishlistView = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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

  const handleSaveEditedWish = useCallback((updated: {
    id: number;
    name: string;
    link: string;
    image: string;
    price: string;
  }) => {
    if (!wishlist) return;
    const next = {
      ...wishlist,
      items: wishlist.items.map((it) => (it.id === updated.id ? { ...it, ...updated } : it)),
    };
    persistWishlist(next);
    setIsEditOpen(false);
  }, [wishlist, persistWishlist]);

  const handleDeleteList = useCallback(() => {
    if (!wishlist) return;
    const confirmed = window.confirm("Вы действительно хотите удалить весь вишлист? Это действие нельзя отменить.");
    if (!confirmed) return;
    try {
      if (wishlist.id != null) {
        deleteWishlist(wishlist.id);
      } else {
        deleteWishlist({ title: wishlist.title, date: wishlist.date });
      }
    } finally {
      // После удаления возвращаемся к списку вишлистов
      window.location.href = '/emptywishlist';
    }
  }, [wishlist]);

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
                  <div>
                    <Button onClick={() => setIsDeleteMode(false)}>
                      Вернуться
                    </Button>
                    <Button onClick={handleDeleteList} className={styles.deleteButton}>
                      Удалить вишлист
                    </Button>
                  </div>
                ) : (
                  <WishlistActions
                    onAddWish={() => setIsModalOpen(true)}
                    onDeleteMode={() => setIsDeleteMode(true)}
                    onEditWish={() => setIsEditOpen(true)}
                    canEdit={(wishlist.items?.length ?? 0) > 0}
                  />
                )}
              </div>

              {isModalOpen && (
                <AddWishModal
                  onClose={() => setIsModalOpen(false)}
                  onAdd={handleAddWish}
                />
              )}
              {isEditOpen && wishlist && (
                <EditWishModal
                  items={wishlist.items}
                  onClose={() => setIsEditOpen(false)}
                  onSave={handleSaveEditedWish}
                />
              )}
            </div>
          <Footer />
      </div>
  );
};

export default WishlistView;
