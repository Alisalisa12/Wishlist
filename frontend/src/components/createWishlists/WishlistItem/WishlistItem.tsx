import styles from "./WishlistItem.module.scss";
import { Trash2, Check } from "lucide-react";
import React from "react";
import Button from "../../UI/buttons/Button";

interface WishlistItemProps {
  _id: string;
  title: string;
  link: string;
  image: string;
  isDeleteMode?: boolean;
  onDelete?: () => void;
  showReserve?: boolean;
  onReserve?: () => void;
  reserved?: boolean;
}

const WishlistItem: React.FC<WishlistItemProps> = React.memo(({
  title,
  link,
  image,
  isDeleteMode,
  onDelete,
  showReserve,
  onReserve,
  reserved,
}) => {
  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <p>{title}</p> 
      </div>
      <div>
        <a href={link} className={styles.link} target="_blank" rel="noreferrer">
          Ссылка
        </a>
      </div>
      <div>
        {image ? (
          <img
            className={styles.imagePlaceholder}
            src={image}
            alt={title}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              // Показать плейсхолдер, не меняя исходные данные
              target.onerror = null;
              target.src = "/images/gift.jpg";
            }}
          />
        ) : (
          <div className={styles.empty}></div>
        )}
      </div>
      <div className={styles.deleteBtnDiv}>
        {isDeleteMode && (
          <Button
            icon={<Trash2 size={18} />}
            onClick={onDelete}
            className={styles.deleteBtn}
          />
        )}

        {!isDeleteMode && showReserve && (
          <Button
            onClick={onReserve}
            disabled={reserved}
            className={styles.reserveBtn}
          >
            {reserved ? <Check size={18} /> : "Выбрать"}
          </Button>
        )}
      </div>
    </div>
  );
});

WishlistItem.displayName = 'WishlistItem';

export default WishlistItem;