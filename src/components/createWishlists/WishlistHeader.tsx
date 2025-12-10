import styles from "../../pages/WishlistView/WishlistView.module.scss";
import React from "react";

interface WishlistHeaderProps {
  title: string;
  date: string;
  access: string;
}

const WishlistHeader: React.FC<WishlistHeaderProps> = ({ title, date }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.date}>{date}</p>
    </div>
  );
};

export default WishlistHeader;
