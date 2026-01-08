import styles from "./WishlistHeader.module.scss";
import React from "react";

interface WishlistHeaderProps {
  title: string;
  eventDate: string | null;
  // Добавили "link", чтобы соответствовать схеме Mongoose
  visibility: "public" | "friends" | "private" | "link"; 
}

const WishlistHeader: React.FC<WishlistHeaderProps> = ({
  title,
  eventDate,
  visibility,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Дата не указана";
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? "Дата не указана"
      : d.toLocaleDateString("ru-RU");
  };

  // Используем объект для сопоставления меток (более масштабируемо)
  const visibilityLabels: Record<string, string> = {
    public: "Публичный",
    friends: "Для друзей",
    private: "Приватный",
    link: "Доступ по ссылке" // Текст для нового типа доступа
  };

  const visibilityLabel = visibilityLabels[visibility] || "Приватный";

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.infoLine}>
        <p className={styles.date}>{formatDate(eventDate)}</p>
        <span className={`${styles.accessBadge} ${styles[visibility]}`}>
          {visibilityLabel}
        </span>
      </div>
    </div>
  );
};

export default WishlistHeader;