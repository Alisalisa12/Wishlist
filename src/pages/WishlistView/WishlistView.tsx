import AddWishModal from "../../components/AddWishModal/AddWishModal";
import PriceCategory from "../../components/createWishlists/PriceCategory";
import WishlistActions from "../../components/createWishlists/WishlistActions";
import WishlistHeader from "../../components/createWishlists/WishlistHeader";
import Button from "../../components/UI/buttons/Button";
import styles from "./WishlistView.module.scss";
import React, { useEffect, useState, useCallback, useMemo } from "react";
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

  // Мемоизация категорий цен для предотвращения пересчета при каждом рендере
  const priceCategories = useMemo(() => ["До 1.000р.", "1.000 - 3.000", "3.000 - 10.000", "10.000+"], []);

  // Мемоизация отфильтрованных элементов для каждой категории
  const categorizedItems = useMemo(() => {
    if (!wishlist) return {};
    return priceCategories.reduce((acc, price) => {
      acc[price] = wishlist.items.filter((i) => i.price === price);
      return acc;
    }, {} as Record<string, typeof wishlist.items>);
  }, [wishlist, priceCategories]);

  if (!wishlist) return <p className={styles.empty}>Вишлист не найден</p>;

  return (
      <div>
          <Header />
    <div className={styles.container}>
      <div className={styles.card}>
        <WishlistHeader
          title={wishlist.title}
          date={wishlist.date}
          access={wishlist.access}
        />

        <div className={styles.categories}>
          {priceCategories.map((price) => (
            <PriceCategory
              key={price}
              title={price}
              items={categorizedItems[price]}
              isDeleteMode={isDeleteMode}
              onDeleteWish={handleDeleteWish}
            />
          ))}
        </div>

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
