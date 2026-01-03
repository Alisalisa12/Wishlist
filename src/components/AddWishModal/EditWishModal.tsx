import React, { useEffect, useMemo, useState } from "react";
import Button from "../UI/buttons/Button";
import styles from "./AddWishModal.module.scss";
import { WishlistItem } from "../../services/wishlistStorage";

interface EditWishModalProps {
  items: WishlistItem[];
  onClose: () => void;
  onSave: (wish: {
    id: number;
    name: string;
    link: string;
    image: string;
    price: string;
  }) => void;
}

const EditWishModal: React.FC<EditWishModalProps> = ({ items, onClose, onSave }) => {
  const hasItems = Array.isArray(items) && items.length > 0;
  const defaultId = useMemo(() => (hasItems ? items[0].id : 0), [hasItems, items]);

  const [selectedId, setSelectedId] = useState<number>(defaultId);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  // Подставляем значения при смене выбранного подарка
  useEffect(() => {
    const current = items.find((it) => it.id === selectedId);
    if (current) {
      setName(current.name || "");
      setLink(current.link || "");
      setImage(current.image || "");
      setPrice(current.price || "");
      setError("");
    }
  }, [selectedId, items]);

  useEffect(() => {
    // при первом открытии выставим данные первого элемента
    if (hasItems) {
      setSelectedId(defaultId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasItems]);

  const handleSave = () => {
    if (!selectedId) return;
    if (!name || !link || !image || !price) {
      setError("Заполните все поля");
      return;
    }
    onSave({ id: selectedId, name, link, image, price });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {!hasItems ? (
          <p>Нет подарков для редактирования</p>
        ) : (
          <>
            <select value={selectedId} onChange={(e) => setSelectedId(parseInt(e.target.value, 10))}>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </select>

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
          </>
        )}

        <div className={styles.actions}>
          <Button onClick={handleSave} disabled={!hasItems}>Сохранить</Button>
          <Button onClick={onClose}>Отмена</Button>
        </div>
      </div>
    </div>
  );
};

export default EditWishModal;
