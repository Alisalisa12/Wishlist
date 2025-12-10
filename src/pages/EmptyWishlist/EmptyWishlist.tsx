import styles from "./EmptyWishlist.module.scss";
import arrowImg from "../../images/Vector.png";
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/buttons/Button";
import {Header} from "../../components/Header/Header";
import {Footer} from "../../components/Footer/Footer";


const EmptyWishlist: React.FC = () => {
  const navigate = useNavigate();
  return (
      <div>
          <Header />
            <section className={styles.wrapper}>
              <h1>Здесь пока пусто(</h1>
              <h1>Самое время начать!</h1>
              <img src={arrowImg} alt="arrow" className={styles.arrow} />
              <Button type="submit" className={styles.addButton} onClick={() => navigate("/create")}>Новый вишлист +</Button>
            </section>
          <Footer />
      </div>

  );
};

export default EmptyWishlist;