import {
  getAllWishlists,
  getWishlist,
  saveCurrentWishlistId,
  createWishlist,
  updateWishlist,
  Wishlist,
} from "./wishlistStorage";

global.fetch = jest.fn();

describe("wishlistStorage API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("getAllWishlists возвращает массив вишлистов из API", async () => {
    const mockData: Wishlist[] = [
      {
        _id: "6596a1b2c3d4",
        title: "Новый год",
        eventDate: "2026-01-01",
        visibility: "public",
        items: [],
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const loaded = await getAllWishlists();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toMatchObject({ title: "Новый год", _id: "6596a1b2c3d4" });
  });

  test("getWishlist и saveCurrentWishlistId работают с ID", async () => {
    const wishlist: Wishlist = {
      _id: "777",
      title: "День рождения",
      eventDate: "2026-10-10",
      visibility: "private",
      items: [],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => wishlist,
    });

    saveCurrentWishlistId(wishlist._id); 

    const current = await getWishlist(wishlist._id);

    expect(current).toMatchObject({ title: "День рождения" });
    expect(localStorage.getItem("currentWishlistId")).toBe("777");
  });

  test("createWishlist вызывает API и сохраняет текущий вишлист", async () => {
    const newWishlist: Wishlist = {
      _id: "100",
      title: "Путешествия",
      eventDate: "2026-05-05",
      visibility: "friends",
      items: [],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => newWishlist,
    });

    const created = await createWishlist(newWishlist);

    expect(created).toMatchObject({ _id: "100" });
    expect(localStorage.getItem("currentWishlistId")).toBe("100");
  });

  test("updateWishlist отправляет запрос на сервер", async () => {
    const updated: Wishlist = {
      _id: "1",
      title: "Обновлённый",
      eventDate: "2026-01-01",
      visibility: "public",
      items: [],
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => updated,
    });

    await updateWishlist(updated);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/wishlists/1"),
      expect.objectContaining({ 
        method: expect.stringMatching(/PATCH|PUT/) 
      })
    );
  });
});