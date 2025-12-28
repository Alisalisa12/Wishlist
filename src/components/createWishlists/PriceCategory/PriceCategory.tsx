import styles from "./PriceCategoty.module.scss";
import WishlistItem from "../WishlistItem/WishlistItem";
import React from "react";

interface PriceCategoryProps {
  title: string;
  items: { id: number; name: string; link: string; image: string }[];
  isDeleteMode: boolean;
  onDeleteWish: (id: number) => void;
  // Для публичного просмотра у друга
  showReserve?: boolean;
  onReserveWish?: (id: number) => void;
  reservedIds?: number[];
}

const PriceCategory: React.FC<PriceCategoryProps> = React.memo(({
  title,
  items,
  isDeleteMode,
  onDeleteWish,
  showReserve,
  onReserveWish,
  reservedIds,
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
            showReserve={showReserve}
            onReserve={() => onReserveWish && onReserveWish(item.id)}
            reserved={reservedIds?.includes(item.id)}
          />
        ))
      ) : (
        <div className={styles.empty}></div>
      )}
    </div>
  );
});

PriceCategory.displayName = 'PriceCategory';

export default PriceCategory;
