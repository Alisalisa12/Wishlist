import React, { useState } from "react";
import Button from "../UI/buttons/Button";
import styles from "./AddWishModal.module.scss";

interface AddWishModalProps {
    onClose: () => void;
    onAdd: (wish: {
        title: string;
        link: string;
        image: string;
        priceCategory: string;
    }) => void;
}

const AddWishModal: React.FC<AddWishModalProps> = ({ onClose, onAdd }) => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!name || !link || !price) {
            setError("Заполните все поля");
            return;
        }

        const finalImage = image.trim() === "" ? "gift.jpg" : image.trim();

        onAdd({
            title: name,
            link,
            image: finalImage,
            priceCategory: price,
        });
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
                    <option value="" disabled>Ценовая категория</option>
                    <option value="до 1000">До 1.000р.</option>
                    <option value="1000-3000">1.000 - 3.000</option>
                    <option value="3000-10000">3.000 - 10.000</option>
                    <option value="10000+">10.000+</option>
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