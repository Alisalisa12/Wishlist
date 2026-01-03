import React, { useEffect, useState, useCallback } from "react";
import styles from "./FriendWishlistView.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import WishlistContent from "../../components/WishlistContent/WishlistContent";
import { getCurrentWishlist, getAllWishlists, Wishlist } from "../../services/wishlistStorage";
import { useParams } from "react-router-dom";
import { useFriends } from "../../hooks/useFriends";

const reservationsKey = (wishlistId?: number | undefined) =>
  `reservations:${wishlistId ?? "current"}`;

const FriendWishlistView: React.FC = () => {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [reservedIds, setReservedIds] = useState<number[]>([]);
  const { id: routeId } = useParams<{ id?: string }>();
  const { allUsers } = useFriends();

  useEffect(() => {
    let selected: Wishlist | null = null;
    if (routeId) {
      const all = getAllWishlists();
      const numericId = parseInt(routeId, 10);
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
  }, [routeId]);

  const handleReserve = useCallback(
    (itemId: number) => {
      setReservedIds((prev) => {
        if (prev.includes(itemId)) return prev;
        const next = [...prev, itemId];
        try {
          localStorage.setItem(
            reservationsKey(wishlist?.id),
            JSON.stringify(next)
          );
          // Также сохраняем подробности брони для страницы "Мои брони"
          if (wishlist) {
            const key = "myReservations";
            const raw = localStorage.getItem(key);
            let saved: any[] = [];
            try {
              saved = raw ? JSON.parse(raw) : [];
            } catch (_) {
              saved = [];
            }

            const item = wishlist.items.find((it) => it.id === itemId);
            if (item) {
              // ищем запись по wishlist.id
              const idx = saved.findIndex((b) => b && b.id === wishlist.id);
              // найдем данные друга по параметру маршрута, при отсутствии — возьмем из localStorage.currentFriend
              const friendId = typeof window !== 'undefined' && typeof Number === 'function' && (typeof routeId === 'string') ? parseInt(routeId, 10) : NaN;
              let friend = !isNaN(friendId) ? allUsers.find(u => u.id === friendId) : undefined;
              if (!friend) {
                try {
                  const rawFriend = localStorage.getItem('currentFriend');
                  const parsed = rawFriend ? JSON.parse(rawFriend) : null;
                  if (parsed && typeof parsed.id === 'number') {
                    friend = {
                      id: parsed.id,
                      avatar: parsed.avatar,
                      name: parsed.name,
                      nickname: parsed.nickname,
                      profileLink: parsed.profileLink,
                    } as any;
                  }
                } catch { /* ignore */ }
              }
              if (idx >= 0) {
                const exists = saved[idx];
                const items = Array.isArray(exists.items) ? exists.items : [];
                const has = items.some((it: any) => it && it.id === item.id);
                const updated = {
                  ...exists,
                  title: wishlist.title,
                  date: wishlist.date,
                  access: wishlist.access,
                  items: has ? items : [...items, item],
                  friend: friend ? {
                    id: friend.id,
                    avatar: friend.avatar,
                    name: friend.name,
                    nickname: friend.nickname,
                    profileLink: friend.profileLink,
                  } : exists.friend,
                };
                saved[idx] = updated;
              } else {
                saved.push({
                  id: wishlist.id,
                  title: wishlist.title,
                  date: wishlist.date,
                  access: wishlist.access,
                  items: [item],
                  friend: friend ? {
                    id: friend.id,
                    avatar: friend.avatar,
                    name: friend.name,
                    nickname: friend.nickname,
                    profileLink: friend.profileLink,
                  } : undefined,
                });
              }
              localStorage.setItem(key, JSON.stringify(saved));
            }
          }
        } catch (e) {
          // ignore
        }
        return next;
      });
    },
    [wishlist?.id, allUsers, routeId]
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
