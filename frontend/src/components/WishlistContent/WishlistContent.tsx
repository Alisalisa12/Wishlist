import React, { useMemo } from "react";
import styles from "./WishlistContent.module.scss";
import WishlistHeader from "../createWishlists/WishlistHeader/WishlistHeader";
import PriceCategory from "../createWishlists/PriceCategory/PriceCategory";
import { Wishlist, WishlistItem } from "../../services/wishlistStorage";

// Props владельца
interface OwnerModeProps {
  mode: "owner";
  isDeleteMode: boolean;
  onDeleteWish: (id: string) => void;
  canEdit?: boolean;
  canReserve?: boolean;
}

// Props публичного режима
interface PublicModeProps {
  mode: "public";
  onReserveWish: (id: string) => void;
  reservedIds: string[];
  currentUserId?: string;
}

// Общие пропсы
interface WishlistContentBaseProps {
  wishlist: Wishlist;
}

type WishlistContentProps =
  WishlistContentBaseProps &
  (OwnerModeProps | PublicModeProps);

type ItemsByPrice = Record<string, WishlistItem[]>;

const WishlistContent: React.FC<WishlistContentProps> = React.memo(
  ({ wishlist, ...rest }) => {
    const priceCategories = useMemo(
      () => ["до 1000", "1000-3000", "3000-10000", "10000+"],
      []
    );

    const categorizedItems = useMemo<ItemsByPrice>(() => {
      const acc: ItemsByPrice = {
        "до 1000": [],
        "1000-3000": [],
        "3000-10000": [],
        "10000+": [],
      };

      const rawItems = wishlist.items || [];
      rawItems.forEach((item) => {
        if (acc[item.priceCategory]) acc[item.priceCategory].push(item);
      });

      return acc;
    }, [wishlist]);

    return (
      <div className={styles.wrapper}>
        <WishlistHeader
          title={wishlist.title}
          eventDate={wishlist.eventDate}
          visibility={wishlist.visibility as
            | "public"
            | "friends"
            | "private"
            | "link"}
        />

        <div className={styles.categories}>
          {priceCategories.map((price) => {
            const itemsInCategory = categorizedItems[price];
            if (itemsInCategory.length === 0 && rest.mode === "public") return null;

            return (
              <PriceCategory
                key={price}
                title={price}
                items={itemsInCategory.map((item) => ({
                  ...item,
                  link: item.link ?? null,
                }))}
                isDeleteMode={rest.mode === "owner" ? rest.isDeleteMode : false}
                onDeleteWish={
                  rest.mode === "owner" && rest.onDeleteWish
                    ? rest.onDeleteWish
                    : () => {}
                }
                showReserve={rest.mode === "public"}
                onReserveWish={rest.mode === "public" ? rest.onReserveWish : undefined}
                reservedIds={
                  rest.mode === "public"
                    ? [
                        ...rest.reservedIds,
                        ...itemsInCategory
                          .filter((item) => !!item.reservedBy)
                          .map((item) => String(item._id)),
                      ]
                    : []
                }
              />
            );
          })}
        </div>
      </div>
    );
  }
);

WishlistContent.displayName = "WishlistContent";

export default WishlistContent;