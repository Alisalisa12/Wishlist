import styles from "../../pages/WishlistView/WishlistView.module.scss";
import WishlistItem from "./WishlistItem";
import React from "react";


interface PriceCategoryProps {
  title: string;
  items: { id: number; name: string; link: string; image: string }[];
}

const PriceCategory: React.FC<PriceCategoryProps> = ({ title, items }) => {
  return (
    <div className={styles.category}>
      <p className={styles.title_price}>{title}</p>
      {items.length > 0 ? (
        items.map((item) => <WishlistItem key={item.id} {...item} />)
      ) : (
        <div className={styles.empty}></div>
      )}
    </div>
  );
};

export default PriceCategory;