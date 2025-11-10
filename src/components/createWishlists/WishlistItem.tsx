import styles from "../../pages/WishlistView/WishlistView.module.scss";
import React from "react";

interface WishlistItemProps {
  name: string;
  link: string;
  image: string;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ name, link, image }) => {
  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <p>{name}</p>
        <a href={link} className={styles.link}>
          Ссылка
        </a>
      </div>
      <div className={styles.imagePlaceholder}>
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <div className={styles.empty}></div>
        )}
      </div>
    </div>
  );
};

export default WishlistItem;
