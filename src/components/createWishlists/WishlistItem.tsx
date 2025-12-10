import styles from "../../pages/WishlistView/WishlistView.module.scss";
import { Trash2 } from "lucide-react";
import React from "react";
import Button from "../UI/buttons/Button";

interface WishlistItemProps {
  name: string;
  link: string;
  image: string;
  isDeleteMode?: boolean;
  onDelete?: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  name,
  link,
  image,
  isDeleteMode,
  onDelete,
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
            icon={<Trash2/>} 
            onClick={onDelete} 
            className={styles.deleteBtn}> </Button>
        )}
      </div>
    </div>
  );
};

export default WishlistItem;
