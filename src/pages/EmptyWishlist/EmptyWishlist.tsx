import styles from "./EmptyWishlist.module.scss";
import arrowImg from "../../images/Vector.png";
import React from "react";
import { useNavigate } from "react-router-dom";


export const EmptyWishlist: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.wrapper}>
      <h1>Здесь пока пусто(</h1>
      <h1>Самое время начать!</h1>
      <img src={arrowImg} alt="arrow" className={styles.arrow} />
      <button
        className={styles.addButton}
        onClick={() => navigate("/create")}
      >
        Новый вишлист +
      </button>
    </section>
  );
};