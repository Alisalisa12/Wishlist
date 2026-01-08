import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import styles from "./myReservations.module.scss";
import { getCurrentUser, unreserveWish, getMyReservations } from "../../api";

const MyReservations: React.FC = () => {
  const [wishes, setWishes] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCurrentUser()
      .then((user) => setCurrentUserId(user._id))
      .catch(() => setCurrentUserId(null))
      .finally(() => setLoading(false));
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getMyReservations();
      setWishes(data);
    } catch (err) {
      setWishes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) loadReservations();
  }, [currentUserId]);

  const handleUnreserve = async (wishId: string) => {
    try {
      await unreserveWish(wishId);
      await loadReservations();
    } catch (err: any) {
      alert(err?.message || "Не удалось снять бронь");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Мои брони</h2>

          {loading ? (
            <p>Загрузка...</p>
          ) : wishes.length === 0 ? (
            <p>У вас пока нет забронированных подарков.</p>
          ) : (
            wishes.map((wish) => (
              <div key={wish._id} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{wish.title}</div>
                  {wish.priceCategory && (
                    <div className={styles.itemPrice}>{wish.priceCategory}</div>
                  )}
                  <div className={styles.itemWishlist}>{wish.wishlist?.title}</div>
                </div>

                <a
                  href={wish.link ?? "#"}
                  className={styles.itemLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ссылка
                </a>

                {wish.image ? (
                  <img
                    className={styles.itemImage}
                    src={wish.image}
                    alt={wish.title}
                  />
                ) : (
                  <div className={styles.itemImagePlaceholder}></div>
                )}

                <button
                  className={styles.unreserveBtn}
                  onClick={() => handleUnreserve(wish._id)}
                >
                  Отменить бронь
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyReservations;