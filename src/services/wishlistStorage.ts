export type WishlistItem = {
  id: number;
  name: string;
  link: string;
  image: string;
  price: string;
};

export type Wishlist = {
  id?: number;
  title: string;
  date: string;
  access: string;
  items: WishlistItem[];
};

const WISHLISTS_KEY = "wishlists";
const CURRENT_WISHLIST_KEY = "currentWishlist";

export function getAllWishlists(): Wishlist[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WISHLISTS_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse wishlists from storage", e);
    return [];
  }
}

export function saveAllWishlists(wishlists: Wishlist[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLISTS_KEY, JSON.stringify(wishlists));
}

export function getCurrentWishlist(): Wishlist | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CURRENT_WISHLIST_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as Wishlist;
  } catch (e) {
    console.error("Failed to parse current wishlist from storage", e);
    return null;
  }
}

export function saveCurrentWishlist(wishlist: Wishlist): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_WISHLIST_KEY, JSON.stringify(wishlist));
}

// Создать новый вишлист: добавляет в общий список и
// помечает его как текущий.
export function createWishlist(newWishlist: Wishlist): void {
  const all = getAllWishlists();
  const updated = Array.isArray(all) ? [...all, newWishlist] : [newWishlist];
  saveAllWishlists(updated);
  saveCurrentWishlist(newWishlist);
}

// Обновить существующий вишлист в общем списке и текущий.
export function updateWishlist(updatedWishlist: Wishlist): void {
  saveCurrentWishlist(updatedWishlist);

  const all = getAllWishlists();

  // если у вишлиста нет id (старые данные), просто не трогаем общий список
  if (updatedWishlist.id == null) return;

  const exists = all.some((w) => w && w.id === updatedWishlist.id);
  const updatedList = exists
    ? all.map((w) => (w && w.id === updatedWishlist.id ? updatedWishlist : w))
    : [...all, updatedWishlist];

  try {
    saveAllWishlists(updatedList);
  } catch (e) {
    console.error("Failed to update wishlists in storage", e);
  }
}
