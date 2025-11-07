import arrowImg from "../../../public/images/Vector.png";
import styles from "./EmptyWishlist.module.scss";
import React from "react";

export const EmptyWishlist: React.FC = () => {
  return (
    <section className={styles.wrapper}>
      <h1>Здесь пока пусто(</h1>
      <h1>Самое время начать!</h1>
      {/* <div className={styles.arrow}>↓</div> */}
      {/* <div><img src="assets/Vector.svg" alt="стрелка" /></div> */}
      <img src={arrowImg} alt="arrow" className={styles.arrow} />
      <button className={styles.addButton}>Новый вишлист +</button>
    </section>
  );
};