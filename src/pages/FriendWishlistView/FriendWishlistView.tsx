import React, { useEffect, useState, useCallback } from "react";
import styles from "./FriendWishlistView.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import WishlistContent from "../../components/WishlistContent/WishlistContent";
import { getCurrentWishlist, getAllWishlists, Wishlist } from "../../services/wishlistStorage";
import { useParams } from "react-router-dom";

const reservationsKey = (wishlistId?: number | undefined) =>
  `reservations:${wishlistId ?? "current"}`;

const FriendWishlistView: React.FC = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [reservedIds, setReservedIds] = useState<number[]>([]);
  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    let selected: Wishlist | null = null;
    if (id) {
      const all = getAllWishlists();
      const numericId = parseInt(id, 10);
      selected = all.find(w => w.id === numericId) ?? null;
    }
    if (!selected) {
      selected = getCurrentWishlist();
    }
    if (selected) {
      setWishlist(selected);
      try {
        const saved = localStorage.getItem(reservationsKey(selected.id));
        if (saved) setReservedIds(JSON.parse(saved));
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [id]);

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
