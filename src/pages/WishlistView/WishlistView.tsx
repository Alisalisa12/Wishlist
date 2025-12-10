import AddWishModal from "../../components/AddWishModal/AddWishModal";
import PriceCategory from "../../components/createWishlists/PriceCategory";
import WishlistActions from "../../components/createWishlists/WishlistActions";
import WishlistHeader from "../../components/createWishlists/WishlistHeader";
import Button from "../../components/UI/buttons/Button";
import styles from "./WishlistView.module.scss";
import React, { useEffect, useState } from "react";
import {Footer} from "../../components/Footer/Footer";
import {Header} from "../../components/Header/Header";

const WishlistView = () => {
  const [wishlist, setWishlist] = useState<{
    id?: number; // id может отсутствовать у старых данных в localStorage
    title: string;
    date: string;
    access: string;
    items: {
      id: number;
      name: string;
      link: string;
      image: string;
      price: string;
    }[];
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentWishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  const persistWishlist = (updatedWishlist: {
    id?: number;
    title: string;
    date: string;
    access: string;
    items: {
      id: number;
      name: string;
      link: string;
      image: string;
      price: string;
    }[];
  }) => {
    setWishlist(updatedWishlist);
    localStorage.setItem("currentWishlist", JSON.stringify(updatedWishlist));

    try {
      const storedList = localStorage.getItem("wishlists");
      if (!storedList) return;

      const parsed = JSON.parse(storedList);
      if (!Array.isArray(parsed)) return;

      // если у вишлиста нет id (старые данные), просто ничего не делаем с общим списком
      if (updatedWishlist.id == null) return;

      const exists = parsed.some((w: any) => w && w.id === updatedWishlist.id);
      const updatedList = exists
        ? parsed.map((w: any) =>
            w && w.id === updatedWishlist.id ? updatedWishlist : w
          )
        : [...parsed, updatedWishlist];

      localStorage.setItem("wishlists", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Failed to update wishlists in localStorage", e);
    }
  };

  const handleAddWish = (wish: {
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
  };

  const handleDeleteWish = (id: number) => {
    if (!wishlist) return;
    const updated = {
      ...wishlist,
      items: wishlist.items.filter((i) => i.id !== id),
    };
    persistWishlist(updated);
  };

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
          {["До 1.000р.", "1.000 - 3.000", "3.000 - 10.000", "10.000+"].map(
            (price) => (
              <PriceCategory
                key={price}
                title={price}
                items={wishlist.items.filter((i) => i.price === price)}
                isDeleteMode={isDeleteMode}
                onDeleteWish={handleDeleteWish}
              />
            )
          )}
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
