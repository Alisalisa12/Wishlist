import {
  getAllWishlists,
  saveAllWishlists,
  getCurrentWishlist,
  saveCurrentWishlist,
  createWishlist,
  updateWishlist,
  Wishlist,
} from "./wishlistStorage";

describe("wishlistStorage service", () => {
  beforeEach(() => {
    // jsdom уже предоставляет localStorage, просто очищаем между тестами
      global.localStorage.clear();
    jest.clearAllMocks();
  });

  test("getAllWishlists возвращает пустой массив, если в хранилище нет данных", () => {
    const result = getAllWishlists();
    expect(result).toEqual([]);
  });

  test("saveAllWishlists и getAllWishlists работают в паре", () => {
    const data: Wishlist[] = [
      {
        id: 1,
        title: "Новый год",
        date: "01.01.2025",
        access: "public",
        items: [],
      },
    ];

    saveAllWishlists(data);
    const loaded = getAllWishlists();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toMatchObject({ title: "Новый год" });
  });

  test("getCurrentWishlist и saveCurrentWishlist сохраняют и читают текущий вишлист", () => {
    const wishlist: Wishlist = {
      id: 10,
      title: "День рождения",
      date: "10.10.2025",
      access: "private",
      items: [],
    };

    saveCurrentWishlist(wishlist);
    const loaded = getCurrentWishlist();

    expect(loaded).not.toBeNull();
    expect(loaded).toMatchObject({ id: 10, title: "День рождения" });
  });

  test("createWishlist добавляет вишлист в общий список и делает его текущим", () => {
    const wishlist: Wishlist = {
      id: 100,
      title: "Путешествия",
      date: "05.05.2025",
      access: "friends",
      items: [],
    };

    createWishlist(wishlist);

    const all = getAllWishlists();
    const current = getCurrentWishlist();

    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: 100 });
    expect(current).toMatchObject({ id: 100 });
  });

  test("updateWishlist обновляет существующий вишлист по id", () => {
    const original: Wishlist = {
      id: 1,
      title: "Старый",
      date: "01.01.2024",
      access: "public",
      items: [],
    };
    const updated: Wishlist = {
      ...original,
      title: "Обновлённый",
    };

    saveAllWishlists([original]);
    updateWishlist(updated);

    const all = getAllWishlists();
    const current = getCurrentWishlist();

    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: 1, title: "Обновлённый" });
    expect(current).toMatchObject({ id: 1, title: "Обновлённый" });
  });

  test("updateWishlist с новым id добавляет вишлист в список", () => {
    const existing: Wishlist = {
      id: 1,
      title: "Первый",
      date: "01.01.2024",
      access: "public",
      items: [],
    };
    const another: Wishlist = {
      id: 2,
      title: "Второй",
      date: "02.02.2024",
      access: "public",
      items: [],
    };

    saveAllWishlists([existing]);
    updateWishlist(another);

    const all = getAllWishlists();

    expect(all).toHaveLength(2);
    expect(all.map((w) => w.id)).toEqual([1, 2]);
  });

  test("updateWishlist не трогает общий список, если id отсутствует", () => {
    const existing: Wishlist = {
      id: 1,
      title: "Первый",
      date: "01.01.2024",
      access: "public",
      items: [],
    };

    saveAllWishlists([existing]);

    const withoutId: Wishlist = {
      title: "Без id",
      date: "02.02.2024",
      access: "private",
      items: [],
    };

    updateWishlist(withoutId);

    const all = getAllWishlists();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: 1, title: "Первый" });
  });
});
