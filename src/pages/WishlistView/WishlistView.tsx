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
    items: { id: number; name: string; link: string; image: string }[];
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentWishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  if (!wishlist) {
    return <p className={styles.empty}>Вишлист не найден</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <WishlistHeader
          title={wishlist.title}
          date={wishlist.date}
          access={wishlist.access}
        />

        <div className={styles.categories}>
          <PriceCategory title="До 1.000р." items={wishlist.items} />
          <PriceCategory title="1.000 - 3.000" items={[]} />
          <PriceCategory title="3.000 - 10.000" items={[]} />
        </div>

        <WishlistActions />
      </div>
    </div>
  );
};

export default WishlistView;
