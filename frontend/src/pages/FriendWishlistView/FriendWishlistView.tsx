import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./FriendWishlistView.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import WishlistContent from "../../components/WishlistContent/WishlistContent";
import { getFriendProfile } from "../../services/friends.api";
import { Wishlist as StoredWishlist, WishlistItem as StoredWishlistItem } from "../../services/wishlistStorage";

const FriendWishlistView: React.FC = () => {
  const [wishlist, setWishlist] = useState<StoredWishlist | null>(null);
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const { id: routeId } = useParams<{ id?: string }>();

  useEffect(() => {
    if (!routeId) return;

    const loadWishlist = async () => {
      try {
        const data = await getFriendProfile(routeId);
        const firstWishlist = data.wishlists?.[0] || null;

        if (firstWishlist) {
          const wl: StoredWishlist = {
            _id: firstWishlist._id,
            title: firstWishlist.title,
            eventDate: firstWishlist.date || firstWishlist.eventDate,
            visibility: (() => {
              const vis = firstWishlist.access || firstWishlist.visibility;
              if (vis === "link" || vis === "public" || vis === "friends" || vis === "private") {
                return vis;
              }
              return "public";
            })(),
            items: firstWishlist.items?.map((item: any): StoredWishlistItem => ({
              _id: item._id || item.id,
              title: item.name,
              image: item.image || item.url || "",
              priceCategory: item.priceCategory || "medium",
              reserved: false,
            })) || [],
          };
          setWishlist(wl);
        } else {
          setWishlist(null);
        }
        setReservedIds([]);
      } catch (err) {
        console.error("Ошибка при загрузке вишлиста:", err);
        setWishlist(null);
      }
    };

    loadWishlist();
  }, [routeId]);

  const handleReserve = useCallback(
    (itemId: string) => {
      if (!wishlist) return;
      if (reservedIds.includes(itemId)) return;
      setReservedIds(prev => [...prev, itemId]);
      // TODO: добавить API вызов для брони предмета на сервере
    },
    [wishlist, reservedIds]
  );

  if (!wishlist) return (
      <div>
          <Header />
            <div className={styles.container}>
                <p className={styles.empty}>Пользователь еще не добавил свои вишлисты</p>
            </div>
          <Footer />
      </div>
  );

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
