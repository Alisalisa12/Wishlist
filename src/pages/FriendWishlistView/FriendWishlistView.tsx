import React, { useEffect, useState, useCallback } from "react";
import styles from "./FriendWishlistView.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import WishlistContent from "../../components/WishlistContent/WishlistContent";
import { getCurrentWishlist, Wishlist } from "../../services/wishlistStorage";

const reservationsKey = (wishlistId?: number | undefined) =>
  `reservations:${wishlistId ?? "current"}`;

const FriendWishlistView: React.FC = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [reservedIds, setReservedIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = getCurrentWishlist();
    if (stored) {
      setWishlist(stored);
      try {
        const saved = localStorage.getItem(reservationsKey(stored.id));
        if (saved) setReservedIds(JSON.parse(saved));
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  const handleReserve = useCallback(
    (id: number) => {
      setReservedIds((prev) => {
        if (prev.includes(id)) return prev;
        const next = [...prev, id];
        try {
          localStorage.setItem(
            reservationsKey(wishlist?.id),
            JSON.stringify(next)
          );
        } catch (e) {
          // ignore
        }
        return next;
      });
    },
    [wishlist?.id]
  );

  if (!wishlist)
    return <p className={styles.empty}>Вишлист не найден</p>;

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <WishlistContent
            wishlist={wishlist}
            mode="public"
            reservedIds={reservedIds}
            onReserveWish={handleReserve}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FriendWishlistView;
