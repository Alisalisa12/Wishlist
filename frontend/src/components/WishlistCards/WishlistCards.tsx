import React from "react";
import styles from "./WishlistCards.module.scss";
import Button from "../UI/buttons/Button";

export interface WishlistCardsProps {
  wishlists: any[]; // Используем any, так как данные теперь с бэкенда
  onOpen: (id: string) => void;
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
          <li key={w._id} className={styles.listItem}>
            <div className={styles.listItemHeader}>{w.title}</div>
            <div className={styles.listItemMeta}>
              {w.eventDate && (
                <span className={styles.date}>
                  {new Date(w.eventDate).toLocaleDateString("ru-RU")}
                </span>
              )}
              <Button
                type="button"
                className={styles.openButton}
                onClick={() => onOpen(w._id)} // Передаем _id бэкенда
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