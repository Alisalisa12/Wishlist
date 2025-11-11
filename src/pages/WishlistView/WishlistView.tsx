import AddWishModal from "../../components/AddWishModal/AddWishModal";
import PriceCategory from "../../components/createWishlists/PriceCategory";
import WishlistActions from "../../components/createWishlists/WishlistActions";
import WishlistHeader from "../../components/createWishlists/WishlistHeader";
import styles from "./WishlistView.module.scss";
import React, { useEffect, useState } from "react";

const WishlistView = () => {
  const [wishlist, setWishlist] = useState<{
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

  useEffect(() => {
    const stored = localStorage.getItem("currentWishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

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
    setWishlist(updated);
    localStorage.setItem("currentWishlist", JSON.stringify(updated));
    setIsModalOpen(false);
  };

  if (!wishlist) return <p className={styles.empty}>Вишлист не найден</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <WishlistHeader
          title={wishlist.title}
          date={wishlist.date}
          access={wishlist.access}
        />

        <div className={styles.categories}>
          <PriceCategory
            title="До 1.000р."
            items={wishlist.items.filter((i) => i.price === "До 1.000р.")}
          />
          <PriceCategory
            title="1.000 - 3.000"
            items={wishlist.items.filter((i) => i.price === "1.000 - 3.000")}
          />
          <PriceCategory
            title="3.000 - 10.000"
            items={wishlist.items.filter((i) => i.price === "3.000 - 10.000")}
          />
          <PriceCategory
            title="10.000+"
            items={wishlist.items.filter((i) => i.price === "10.000+")}
          />
        </div>

        <WishlistActions onAddWish={() => setIsModalOpen(true)} />
      </div>

      {isModalOpen && (
        <AddWishModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddWish}
        />
      )}
    </div>
  );
};

export default WishlistView;
