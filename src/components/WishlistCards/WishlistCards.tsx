import React from "react";
import styles from "./WishlistCards.module.scss";
import Button from "../UI/buttons/Button";
import { Wishlist } from "../../services/wishlistStorage";

export interface WishlistCardsProps {
  wishlists: Wishlist[];
  onOpen: (wishlist: Wishlist) => void;
  buttonText?: string;
  className?: string;
}

const WishlistCards: React.FC<WishlistCardsProps> = ({
  wishlists,
  onOpen,
  buttonText = "Перейти",
  className,
}) => {
  if (!wishlists || wishlists.length === 0) return null;

  return (
    <div className={`${styles.listContainer} ${className ?? ""}`.trim()}>
      <ul className={styles.list}>
        {wishlists.map((w) => (
          <li key={w.id} className={styles.listItem}>
            <div className={styles.listItemHeader}>{w.title}</div>
            <div className={styles.listItemMeta}>
              {w.date && <span className={styles.date}>{w.date}</span>}
              <Button
                type="button"
                className={styles.openButton}
                onClick={() => onOpen(w)}
              >
                {buttonText}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WishlistCards;
