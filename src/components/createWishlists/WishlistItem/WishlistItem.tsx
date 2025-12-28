import styles from "./WishlistItem.module.scss";
import { Trash2, Check } from "lucide-react";
import React from "react";
import Button from "../../UI/buttons/Button";

interface WishlistItemProps {
  name: string;
  link: string;
  image: string;
  isDeleteMode?: boolean;
  onDelete?: () => void;
  // Публичный режим просмотра: кнопка "Забронировать"
  showReserve?: boolean;
  onReserve?: () => void;
  reserved?: boolean;
}

const WishlistItem: React.FC<WishlistItemProps> = React.memo(({
  name,
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
        <p>{name}</p>
      </div>
      <div>
        <a href={link} className={styles.link}>
          Ссылка
        </a>
      </div>
      <div>
        {image ? (
          <img className={styles.imagePlaceholder} src={image} alt={name} />
        ) : (
          <div className={styles.empty}></div>
        )}
      </div>
      <div className={styles.deleteBtnDiv}>
        {isDeleteMode && (
          <Button
            icon={<Trash2 />}
            onClick={onDelete}
            className={styles.deleteBtn}
          >
          </Button>
        )}

        {!isDeleteMode && showReserve && (
          <Button
            onClick={onReserve}
            disabled={reserved}
            className={styles.reserveBtn}
          >
            {reserved ? <Check /> : "Выбрать"}
          </Button>
        )}
      </div>
    </div>
  );
});

WishlistItem.displayName = 'WishlistItem';

export default WishlistItem;
