import React, { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import styles from "./myReservations.module.scss";
import { getAllWishlists, Wishlist } from "../../services/wishlistStorage";

const reservationsKey = (wishlistId?: number | undefined) =>
  `reservations:${wishlistId ?? "current"}`;

type ReservedBundle = {
  wishlist: Wishlist;
  reservedIds: number[];
};

type FriendBrief = {
  id: number;
  avatar: string;
  name: string;
  nickname: string;
  profileLink: string;
};

const MyReservations: React.FC = () => {
  const [bundles, setBundles] = useState<ReservedBundle[]>([]);
  const [friendsByWishlistId, setFriendsByWishlistId] = useState<Record<number, FriendBrief | undefined>>({});

  useEffect(() => {
    const all = getAllWishlists();
    const collected: ReservedBundle[] = [];
    const friendsMap: Record<number, FriendBrief | undefined> = {};
    all.forEach((w) => {
      try {
        const raw = localStorage.getItem(reservationsKey(w.id));
        const ids = raw ? (JSON.parse(raw) as number[]) : [];
        if (Array.isArray(ids) && ids.length > 0) {
          // фильтруем только забронированные айтемы
          const items = w.items.filter((it) => ids.includes(it.id));
          if (items.length > 0) {
            collected.push({ wishlist: { ...w, items }, reservedIds: ids });
          }
        }
      } catch (e) {
        // ignore
      }
    });
    try {
      const raw = localStorage.getItem("myReservations");
      const saved = raw ? JSON.parse(raw) : [];
      let changed = false;
      let currentFriend: FriendBrief | null = null;
      try {
        const cfRaw = localStorage.getItem('currentFriend');
        const cf = cfRaw ? JSON.parse(cfRaw) : null;
        if (cf && typeof cf.id === 'number') {
          currentFriend = {
            id: cf.id,
            avatar: cf.avatar,
            name: cf.name,
            nickname: cf.nickname,
            profileLink: cf.profileLink,
          };
        }
      } catch { /* ignore */ }

      if (Array.isArray(saved)) {
        saved.forEach((entry: any, idx: number) => {
          if (entry && typeof entry.id === 'number') {
            if (entry.friend) {
              friendsMap[entry.id] = entry.friend as FriendBrief;
            } else if (currentFriend) {
              friendsMap[entry.id] = currentFriend;
              saved[idx] = { ...entry, friend: currentFriend };
              changed = true;
            }
          }
        });
      }
      if (changed) {
        try { localStorage.setItem('myReservations', JSON.stringify(saved)); } catch { /* ignore */ }
      }
    } catch {}
    setBundles(collected);
    setFriendsByWishlistId(friendsMap);
  }, []);


  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Мои брони</h2>

          {bundles.length === 0 ? (
            <p>У вас пока нет забронированных подарков.</p>
          ) : (
            bundles.map(({ wishlist }) => {
              const friend = typeof wishlist.id === 'number' ? friendsByWishlistId[wishlist.id] : undefined;
              return (
                <div key={wishlist.id} className={styles.bundle}>
                  {/* Событие: название и дата */}
                  <div className={styles.eventLine}>
                      {wishlist.date} {wishlist.title}
                  </div>

                  <div className={styles.items}>
                    {wishlist.items.map((it) => (
                      <div key={it.id} className={styles.itemRow}>
                        {/* Левая колонка: пользователь (для кого подарок) */}
                        <div className={styles.friendCol}>
                          {friend ? (
                            <div className={styles.rowFriend}>
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className={styles.friendMiniAvatar}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/images/friendAvatar.jpg';
                                }}
                              />
                              <div className={styles.friendMiniInfo}>
                                <div className={styles.friendName}>{friend.name}</div>
                                <div className={styles.friendNick}>{friend.nickname}</div>
                                <a className={styles.profileBtn} href={friend.profileLink}>перейти в профиль</a>
                              </div>
                            </div>
                          ) : (
                            <div />
                          )}
                        </div>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemTitle}>{it.name}</div>
                          {it.price && <div className={styles.itemPrice}>{it.price}</div>}
                        </div>
                        <a href={it.link} className={styles.itemLink}>Ссылка</a>
                        {it.image ? (
                          <img className={styles.itemImage} src={it.image} alt={it.name} />
                        ) : (
                          <div className={styles.itemImagePlaceholder}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyReservations;
