import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./WishlistView.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import WishlistContent from "../../components/WishlistContent/WishlistContent";
import WishlistActions from "../../components/createWishlists/WishlistActions";
import AddWishModal from "../../components/AddWishModal/AddWishModal";
import EditWishModal from "../../components/AddWishModal/EditWishModal";
import Button from "../../components/UI/buttons/Button";
import { getCurrentUser, reserveWish } from "../../api";

import {
  getWishlist,
  deleteWishlist,
  addWish,
  removeWish,
  updateWish,
} from "../../services/wishlistStorage";

const WishlistView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getWishlist(id); // Wishlist | null

      if (!response) {
        setWishlist(null);
        return;
      }

      setWishlist(response);
    } catch (err) {
      console.error("Ошибка при загрузке вишлиста:", err);
      setWishlist(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUserId(user._id))
      .catch(() => setCurrentUserId(null));
  }, []);

  useEffect(() => {
    if (wishlist) {
      // Для отладки: посмотреть структуру объекта вишлиста
      console.log('wishlist:', wishlist);
    }
  }, [wishlist]);

  const handleAddWish = useCallback(
    async (wishData: any) => {
      if (!id) return;
      try {
        await addWish(id, wishData);
        await loadData();
        setIsModalOpen(false);
      } catch (err) {
        alert("Ошибка при добавлении подарка");
      }
    },
    [id, loadData]
  );

  const handleDeleteWish = useCallback(
    async (wishId: string) => {
      try {
        await removeWish(wishId);
        setWishlist((prev: any) => ({
          ...prev,
          items: (prev.items || prev.wishes || []).filter(
            (i: any) => i._id !== wishId
          ),
        }));
      } catch (err) {
        alert("Не удалось удалить подарок");
      }
    },
    []
  );

  const handleSaveEditedWish = useCallback(
    async (updatedWish: any) => {
      try {
        await updateWish(updatedWish._id, updatedWish);
        await loadData();
        setIsEditOpen(false);
      } catch (err) {
        alert("Ошибка при обновлении");
      }
    },
    [loadData]
  );

  const handleDeleteList = useCallback(async () => {
    if (!id) return;
    if (!window.confirm("Вы уверены, что хотите удалить этот список?")) return;
    try {
      await deleteWishlist(id);
      navigate("/wishlists/me");
    } catch (e) {
      alert("Не удалось удалить список");
    }
  }, [id, navigate]);

  const handleShare = useCallback(() => {
    if (!wishlist) return;
    const token = wishlist.linkToken;
    const shareUrl = token
      ? `${window.location.origin}/friend-wishlist/${wishlist._id}?token=${token}`
      : `${window.location.origin}/friend-wishlist/${wishlist._id}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Ссылка для друзей скопирована!");
  }, [wishlist]);

  // Определяем, друг ли это (не владелец и авторизован)
  const isOwner = currentUserId === wishlist?.user;
  const canReserve = Boolean(currentUserId && !isOwner);
  const reservedIds = (wishlist?.items || [])
    .filter((item: any) => !!item.reservedBy)
    .map((item: any) => String(item._id));

  // Функция для бронирования желания
  const handleReserveWish = useCallback(
    async (wishId: string) => {
      try {
        await reserveWish(wishId);
        await loadData();
      } catch (err: any) {
        alert(err?.message || "Не удалось забронировать подарок");
      }
    },
    [loadData]
  );

  if (isLoading)
    return <div className={styles.loader}>Загрузка данных...</div>;

  if (!wishlist)
    return <div className={styles.error}>Вишлист не найден</div>;

  return (
    <div className={styles.pageWrapper}>
      <Header />
      {/* Для отладки: показать id пользователя и владельца
      <div style={{background: '#ffe', padding: 8, margin: 8, fontSize: 14}}>
        <div>currentUserId: {String(currentUserId)}</div>
        <div>wishlist.ownerId: {String(wishlist?.ownerId)}</div>
        <div>wishlist.userId: {String(wishlist?.userId)}</div>
        <div>wishlist._id: {String(wishlist?._id)}</div>
      </div> */}

      <div className={styles.container}>
        <div className={styles.card}>
          <WishlistContent
            wishlist={wishlist}
            {...(isOwner
              ? {
                  mode: "owner" as const,
                  isDeleteMode,
                  onDeleteWish: handleDeleteWish,
                }
              : {
                  mode: "public" as const,
                  onReserveWish: (id: string) => { if (canReserve) void handleReserveWish(id); },
                  reservedIds,
                  currentUserId: currentUserId || undefined,
                })}
          />

          <div className={styles.actionsContainer}>
            {isDeleteMode ? (
              <div className={styles.deleteActions}>
                <Button onClick={() => setIsDeleteMode(false)}>Вернуться</Button>
                <Button
                  onClick={handleDeleteList}
                  className={styles.deleteButton}
                >
                  Удалить вишлист
                </Button>
              </div>
            ) : (
              <WishlistActions
                onAddWish={() => setIsModalOpen(true)}
                onDeleteMode={() => setIsDeleteMode(true)}
                onEditWish={() => setIsEditOpen(true)}
                onShare={() => handleShare()}
                canEdit={true}
                isOwner={currentUserId === wishlist.user} // только владельцу видны кнопки
              />
            )}
          </div>
        </div>

        {isModalOpen && (
          <AddWishModal
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddWish}
          />
        )}

        {isEditOpen && (
          <EditWishModal
            items={wishlist.items || wishlist.wishes || []}
            onClose={() => setIsEditOpen(false)}
            onSave={handleSaveEditedWish}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default WishlistView;