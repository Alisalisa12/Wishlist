import Button from "../../components/UI/buttons/Button";
import AccessSelect from "../../components/createWishlists/AccessSelect";
import FormField from "../../components/createWishlists/FormField";
import styles from "./CreateWishlists.module.scss";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateWishlist = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [access, setAccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !access) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    // сохраняем данные в localStorage
    const newWishlist = {
      title,
      date: date.toLocaleDateString("ru-RU"),
      access,
      items: [],
    };

    localStorage.setItem("currentWishlist", JSON.stringify(newWishlist));

    navigate("/wishlist");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Создать новый вишлист</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormField
          placeholder="Название вишлиста"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <ReactDatePicker
          selected={date}
          onChange={setDate}
          placeholderText="Дата"
          dateFormat="dd.MM.yyyy"
        />

        <AccessSelect
          value={access}
          onChange={(e) => setAccess(e.target.value)}
        />

        <Button type="submit" onClick={() => navigate("/wishlist")}>+ Создать вишлист</Button>
      </form>
    </div>
  );
};

export default CreateWishlist;
