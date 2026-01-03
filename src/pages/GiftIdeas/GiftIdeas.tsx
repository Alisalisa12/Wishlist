import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import Button from "../../components/UI/buttons/Button";
import styles from "./GiftIdeas.module.scss";
import { useNavigate } from "react-router-dom";

interface Idea {
  id: number;
  title: string;
}

const ideas: Idea[] = [
  { id: 1, title: "Что подарить девушке на День Рождения?"},
  { id: 2, title: "Что подарить парню на День Рождения?"},
  { id: 3, title: "Что подарить подруге на День Рождения?" },
  { id: 4, title: "Что подарить другу на День Рождения?"},
  { id: 5, title: "Что подарить девушке на Новый год?" },
  { id: 6, title: "Что подарить парню на Новый год?" },
    { id: 7, title: "Что подарить подруге на Новый год?" },
    { id: 8, title: "Что подарить другу на Новый год?" },
];

const GiftIdeas: React.FC = () => {
  const navigate = useNavigate();

  const handleGo = (id: number, title: string) => {
    navigate(`/ideas/${id}`, { state: { title } });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.hero}>
        <div className={styles.card}>
          <h1 className={styles.title}>Идеи подарков</h1>
          <div className={styles.grid}>
            {ideas.map((idea) => (
              <div className={styles.ideaCard} key={idea.id}>
                <div className={styles.ideaTitle}>{idea.title}</div>
                <Button className={styles.ideaButton} onClick={() => handleGo(idea.id, idea.title)}>Перейти</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GiftIdeas;
