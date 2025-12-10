import Button from "../../components/UI/buttons/Button";
import AccessSelect from "../../components/createWishlists/AccessSelect";
import FormField from "../../components/createWishlists/FormField";
import styles from "./CreateWishlists.module.scss";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Footer} from "../../components/Footer/Footer";
import {Header} from "../../components/Header/Header";

const CreateWishlist = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [access, setAccess] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    access?: string;
  }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!title) newErrors.title = "Введите название вишлиста";
    if (!date) newErrors.date = "Выберите дату";
    if (!access) newErrors.access = "Выберите настройки доступа";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const newWishlist = {
      title,
      date: date?.toLocaleDateString("ru-RU"),
      access,
      items: [],
    };

    localStorage.setItem("currentWishlist", JSON.stringify(newWishlist));
    navigate("/wishlist");
  };

  return (
      <div>
          <Header />
            <div className={styles.container}>
              <h1 className={styles.title}>Создать новый вишлист</h1>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldGroup}>
                  <FormField
                    placeholder="Название вишлиста"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && <p className={styles.error}>{errors.title}</p>}
                </div>

                <div className={styles.fieldGroup}>
                  <ReactDatePicker
                    selected={date}
                    onChange={setDate}
                    placeholderText="Дата"
                    dateFormat="dd.MM.yyyy"
                  />
                  {errors.date && <p className={styles.error}>{errors.date}</p>}
                </div>

                <div className={styles.fieldGroup}>
                  <AccessSelect
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                  />
                  {errors.access && <p className={styles.error}>{errors.access}</p>}
                </div>

                <Button type="submit" className={styles.button}>+ Создать вишлист</Button>
              </form>
            </div>
          <Footer />
      </div>
  );
};

export default CreateWishlist;
