import styles from "../../pages/WishlistView/WishlistView.module.scss";
import WishlistItem from "./WishlistItem";
import React from "react";

interface PriceCategoryProps {
  title: string;
  items: { id: number; name: string; link: string; image: string }[];
  isDeleteMode: boolean;
  onDeleteWish: (id: number) => void;
}

const PriceCategory: React.FC<PriceCategoryProps> = ({
  title,
  items,
  isDeleteMode,
  onDeleteWish,
}) => {
  return (
    <div className={styles.category}>
      <p className={styles.title_price}>{title}</p>
      {items.length > 0 ? (
        items.map((item) => (
          <WishlistItem
            key={item.id}
            {...item}
            isDeleteMode={isDeleteMode}
            onDelete={() => onDeleteWish(item.id)}
          />
        ))
      ) : (
        <div className={styles.empty}></div>
      )}
    </div>
  );
};

export default PriceCategory;
