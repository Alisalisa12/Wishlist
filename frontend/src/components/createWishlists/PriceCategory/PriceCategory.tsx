import styles from "./PriceCategoty.module.scss";
import WishlistItem from "../WishlistItem/WishlistItem";
import React from "react";

interface PriceCategoryProps {
  title: string;
  // Типы обновлены под MongoDB (_id: string, title: string)
  items: { _id: string; title: string; link: string | null; image: string }[];
  isDeleteMode: boolean;
  onDeleteWish: (id: string) => void;
  // Для публичного просмотра у друга
  showReserve?: boolean;
  onReserveWish?: (id: string) => void;
  reservedIds?: string[];
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
            key={item._id}
            _id={item._id}
            title={item.title}
            link={item.link ?? ""} // Если link равно null, передаем пустую строку
            image={item.image}
            isDeleteMode={isDeleteMode}
            onDelete={() => onDeleteWish(item._id)}
            showReserve={showReserve}
            onReserve={() => onReserveWish && onReserveWish(item._id)}
            reserved={reservedIds?.includes(item._id)}
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