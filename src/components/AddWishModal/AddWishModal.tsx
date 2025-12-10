import Button from "../UI/buttons/Button";
import styles from "./AddWishModal.module.scss";
import React, { useState } from "react";

interface AddWishModalProps {
  onClose: () => void;
  onAdd: (wish: {
    name: string;
    link: string;
    image: string;
    price: string;
  }) => void;
}

const AddWishModal: React.FC<AddWishModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name || !link || !image || !price) {
      setError("Заполните все поля");
      return;
    }
    onAdd({ name, link, image, price });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <input
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Ссылка"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <input
          placeholder="Изображение (URL)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <select value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="" disabled>
            Ценовая категория
          </option>
          <option>До 1.000р.</option>
          <option>1.000 - 3.000</option>
          <option>3.000 - 10.000</option>
          <option>10.000+</option>
        </select>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <Button onClick={handleSubmit}>Добавить</Button>
          <Button onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  );
};

export default AddWishModal;
