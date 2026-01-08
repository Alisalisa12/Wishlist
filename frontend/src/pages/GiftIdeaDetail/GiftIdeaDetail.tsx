import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import styles from "./GiftIdeaDetail.module.scss";
import { useLocation, useParams } from "react-router-dom";

interface LocationState {
  title?: string;
}

const GiftIdeaDetail: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;

  const title = state.title || `Идея подарка #${id}`;

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.hero}>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.content}>
            Какой-то текст очень интересной и полезной статьи
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiftIdeaDetail;
