import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './CreateWishlists.module.scss';

import Button from '../../components/UI/buttons/Button';
import AccessSelect from '../../components/createWishlists/AccessSelect';
import FormField from '../../components/createWishlists/FormField';
import { Footer } from '../../components/Footer/Footer';
import { Header } from '../../components/Header/Header';
import { createWishlist } from '../../api'; 

const CreateWishlist: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  const [access, setAccess] = useState<"public" | "friends" | "private" | "link">("public"); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; date?: string; server?: string }>({});

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!title.trim()) {
      setErrors({ title: 'Введите название вишлиста' });
      return;
    }

    try {
      setLoading(true);
      const eventDateISO = date ? date.toISOString() : "";
      await createWishlist(title, eventDateISO, access);
      
      navigate('/wishlist'); 
    } catch (err: any) {
      setErrors({ server: err.message || 'Ошибка при сохранении' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Создать новый вишлист</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.server && <p className={styles.errorServer}>{errors.server}</p>}

          <div className={styles.fieldGroup}>
            <FormField
              placeholder="Название вишлиста"
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            />
            {errors.title && <p className={styles.error}>{errors.title}</p>}
          </div>

          <div className={styles.fieldGroup}>
            <ReactDatePicker
              selected={date}
              onChange={(d: Date | null) => setDate(d)}
              placeholderText="Дата события"
              dateFormat="dd.MM.yyyy"
              className={styles.datepickerInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <AccessSelect 
              value={access} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setAccess(e.target.value as "public" | "friends" | "private" | "link")
              } 
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : '+ Создать вишлист'}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CreateWishlist;
