import React, { useMemo } from "react";
import styles from "./WishlistContent.module.scss";
import WishlistHeader from "../createWishlists/WishlistHeader/WishlistHeader";
import PriceCategory from "../createWishlists/PriceCategory/PriceCategory";
import { Wishlist, WishlistItem } from "../../services/wishlistStorage";

interface WishlistContentBaseProps {
  wishlist: Wishlist;
}

interface OwnerModeProps {
  mode: "owner";
  isDeleteMode: boolean;
  onDeleteWish: (id: number) => void;
}

interface PublicModeProps {
  mode: "public";
  reservedIds: number[];
  onReserveWish: (id: number) => void;
}

type WishlistContentProps = WishlistContentBaseProps & (OwnerModeProps | PublicModeProps);

type ItemsByPrice = Record<string, WishlistItem[]>;

const WishlistContent: React.FC<WishlistContentProps> = React.memo(({ wishlist, ...rest }) => {
  const priceCategories = useMemo(
    () => ["До 1.000р.", "1.000 - 3.000", "3.000 - 10.000", "10.000+"],
    []
  );

  const categorizedItems = useMemo<ItemsByPrice>(() => {
    if (!wishlist) return {} as ItemsByPrice;
    return priceCategories.reduce<ItemsByPrice>((acc, price) => {
      acc[price] = wishlist.items.filter((i) => i.price === price);
      return acc;
    }, {} as ItemsByPrice);
  }, [wishlist, priceCategories]);

  return (
    <>
      <WishlistHeader
        title={wishlist.title}
        date={wishlist.date}
        access={wishlist.access}
      />

      <div className={styles.categories}>
        {priceCategories.map((price) => (
          <PriceCategory
            key={price}
            title={price}
            items={categorizedItems[price] ?? []}
            isDeleteMode={rest.mode === "owner" ? rest.isDeleteMode : false}
            onDeleteWish={rest.mode === "owner" ? rest.onDeleteWish : () => {}}
            showReserve={rest.mode === "public"}
            onReserveWish={rest.mode === "public" ? rest.onReserveWish : undefined}
            reservedIds={rest.mode === "public" ? rest.reservedIds : undefined}
          />
        ))}
      </div>
    </>
  );
});

WishlistContent.displayName = "WishlistContent";

export default WishlistContent;
