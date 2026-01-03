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

// Удалить вишлист из общего списка; если он является текущим — сбросить currentWishlist
export function deleteWishlist(target: Wishlist | { id?: number; title?: string; date?: string } | number): void {
  if (typeof window === "undefined") return;

  const all = getAllWishlists();

  // Определяем условие удаления
  let predicate: (w: Wishlist) => boolean;
  if (typeof target === 'number') {
    const id = target;
    predicate = (w) => (w.id != null ? w.id === id : false);
  } else if (typeof target === 'object') {
    const t = target as Partial<Wishlist>;
    if (t.id != null) {
      predicate = (w) => w.id === t.id;
    } else {
      // Фолбэк на совпадение по названию и дате, если нет id (для очень старых данных)
      const title = t.title;
      const date = t.date;
      predicate = (w) => (title ? w.title === title : true) && (date ? w.date === date : true);
    }
  } else {
    return;
  }

  const filtered = all.filter((w) => !predicate(w));
  saveAllWishlists(filtered);

  // Если текущий соответствует удалённому — очистим
  try {
    const current = getCurrentWishlist();
    if (current && predicate(current)) {
      localStorage.removeItem(CURRENT_WISHLIST_KEY);
    }
  } catch { /* ignore */ }
}
