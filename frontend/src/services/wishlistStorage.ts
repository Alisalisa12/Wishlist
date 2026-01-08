import {
  getMyWishlists,
  getWishlist as fetchSingleWishlist,
  createWishlist as apiCreateWishlist,
  updateWishlist as apiUpdateWishlist,
  deleteWishlist as apiDeleteWishlist,
  createWish as apiCreateWish,
  deleteWish as apiDeleteWish,
  updateWish as apiUpdateWish,
} from "../api";

export type PriceCategory =
  | "до 1000"
  | "1000-3000"
  | "3000-10000"
  | "10000+";

export type WishlistItem = {
  _id: string;
  title: string;
  link?: string | null;
  image: string;
  priceCategory: PriceCategory;
  reserved: boolean;
  reservedBy?: string | null;
};

export type Wishlist = {
  _id: string;
  title: string;
  eventDate: string | null;
  visibility: "public" | "friends" | "private" | "link";
  items: WishlistItem[];
  linkToken?: string;
};

const CURRENT_ID_KEY = "currentWishlistId";

export async function getAllWishlists(): Promise<Wishlist[]> {
  return await getMyWishlists();
}

export async function getWishlist(id: string): Promise<Wishlist | null> {
  if (!id) return null;
  return await fetchSingleWishlist(id);
}

export function saveCurrentWishlistId(id: string): void {
  localStorage.setItem(CURRENT_ID_KEY, id);
}

export async function createWishlist(
  data: Partial<Wishlist>
): Promise<Wishlist> {
  const created = await apiCreateWishlist(
    data.title ?? "Новый список",
    data.eventDate ?? "", 
    data.visibility ?? "public"
  );

  if (created?._id) saveCurrentWishlistId(created._id);
  return created;
}

export async function updateWishlist(wishlist: Wishlist): Promise<void> {
  await apiUpdateWishlist(
    wishlist._id,
    wishlist.title,
    wishlist.eventDate ?? "",
    wishlist.visibility
  );
}

export async function deleteWishlist(id: string): Promise<void> {
  await apiDeleteWishlist(id);
  if (localStorage.getItem(CURRENT_ID_KEY) === id) {
    localStorage.removeItem(CURRENT_ID_KEY);
  }
}



export async function addWish(
  wishlistId: string,
  data: {
    title: string;
    priceCategory?: PriceCategory;
    link?: string | null;
    image?: string | null;
  }
) {
  return await apiCreateWish(
    wishlistId,
    data.title,
    data.priceCategory ?? "до 1000",
    data.link ?? undefined,
    data.image ?? undefined
  );
}

export async function removeWish(wishId: string) {
  return await apiDeleteWish(wishId);
}

export async function updateWish(
  wishId: string,
  data: Partial<WishlistItem>
) {
  return await apiUpdateWish(wishId, data);
}