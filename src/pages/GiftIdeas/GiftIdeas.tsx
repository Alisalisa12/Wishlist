import React from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import Button from "../../components/UI/buttons/Button";
import styles from "./GiftIdeas.module.scss";

interface Idea {
  id: number;
  title: string;
  link?: string;
}

const ideas: Idea[] = [
  { id: 1, title: "Что подарить девушке на День Рождения?", link: "https://ya.ru/" },
  { id: 2, title: "Что подарить парню на День Рождения?", link: "https://ya.ru/" },
  { id: 3, title: "Что подарить подруге на День Рождения?", link: "https://ya.ru/" },
  { id: 4, title: "Что подарить другу на День Рождения?", link: "https://ya.ru/" },
  { id: 5, title: "Что подарить девушке на Новый год?", link: "https://ya.ru/" },
  { id: 6, title: "Что подарить парню на Новый год?", link: "https://ya.ru/" },
    { id: 7, title: "Что подарить подруге на Новый год?", link: "https://ya.ru/" },
    { id: 8, title: "Что подарить другу на Новый год?", link: "https://ya.ru/" },
];

const GiftIdeas: React.FC = () => {
  const handleGo = (link?: string) => {
    if (link) window.open(link, "_blank");
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
                <Button className={styles.ideaButton} onClick={() => handleGo(idea.link)}>Перейти</Button>
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
