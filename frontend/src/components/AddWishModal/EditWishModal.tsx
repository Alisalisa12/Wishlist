import React, { useEffect, useMemo, useState } from "react";
import Button from "../UI/buttons/Button";
import styles from "./AddWishModal.module.scss"; // Используем те же стили
import { WishlistItem } from "../../services/wishlistStorage";

interface EditWishModalProps {
  items: WishlistItem[];
  onClose: () => void;
  onSave: (wish: {
    _id: string;      // MongoDB использует _id
    title: string;    // В бэкенде title
    link: string;
    image?: string;
    priceCategory: string;
  }) => void;
}

const EditWishModal: React.FC<EditWishModalProps> = ({ items, onClose, onSave }) => {
  const hasItems = Array.isArray(items) && items.length > 0;
  const defaultId = useMemo(() => (hasItems ? items[0]._id : ""), [hasItems, items]);

  const [selectedId, setSelectedId] = useState<string>(defaultId);
        const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const current = items.find((it) => it._id === selectedId);
    if (current) {
      setName(current.title || ""); 
      setLink(current.link || "");
      setImage(current.image || "");
      setPrice(current.priceCategory || ""); 
      setError("");
    }
  }, [selectedId, items]);

  useEffect(() => {
    if (hasItems && !selectedId) {
      setSelectedId(defaultId);
    }
  }, [hasItems, defaultId, selectedId]);

  const handleSave = () => {
    if (!selectedId) return;
    if (!name || !link || !price) {
      setError("Заполните обязательные поля");
      return;
    }
    
    onSave({ 
      _id: selectedId, 
      title: name, 
      link,
      image: image.trim() || undefined,
      priceCategory: price 
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {!hasItems ? (
          <p>Нет подарков для редактирования</p>
        ) : (
          <>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              {items.map((it) => (
                <option key={it._id} value={it._id}>
                  {it.title}
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
              <option value="" disabled>Ценовая категория</option>
              <option value="до 1000">до 1000</option>
              <option value="1000-3000">1000-3000</option>
              <option value="3000-10000">3000-10000</option>
              <option value="10000+">10000+</option>
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