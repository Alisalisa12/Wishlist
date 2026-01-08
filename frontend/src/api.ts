const API_URL = 'http://localhost:7777';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}

export async function loginUser(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = Array.isArray(data) ? data[0].msg : data.message;
        throw new Error(errorMessage || 'Ошибка при логине');
    }

    return data; // { token, _id, email, fullName, username, avatarUrl, ... }
}

export async function registerUser(email: string, fullName: string, username: string, password: string, passwordConfirm: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, username, password, passwordConfirm }),
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = Array.isArray(data) ? data[0].msg : data.message;
        throw new Error(errorMessage || 'Ошибка при регистрации');
    }

    return data; // { token, _id, email, fullName, username, avatarUrl, ... }
}

export async function getCurrentUser() {
    const res = await fetchWithAuth('/auth/me');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Не удалось получить профиль');
    return data;
}

export async function updateProfile(fullName: string, username: string, avatarUrl?: string) {
    const res = await fetchWithAuth('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ fullName, username, avatarUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Не удалось обновить профиль');
    return data;
}

export async function removeAccount() {
    const res = await fetchWithAuth('/auth/me', { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Не удалось удалить аккаунт');
    return data;
}
// Вишлисты 
export async function getMyWishlists() {
  const res = await fetchWithAuth("/wishlists/me");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Не удалось получить вишлисты");
  return Array.isArray(data) ? data : [];
}

export async function getWishlist(id: string) {
  if (!id || typeof id !== "string") {
    throw new Error("Некорректный ID вишлиста");
  }

  const res = await fetchWithAuth(`/wishlists/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Вишлист не найден");
  return data;
}

// Создание вишлиста
export async function createWishlist(
  title: string,
  eventDate: string, // обязательная дата
  visibility: "public" | "friends" | "private" | "link"
) {
  const res = await fetchWithAuth("/wishlists", {
    method: "POST",
    body: JSON.stringify({ title, eventDate, visibility }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

// Обновление вишлиста
export async function updateWishlist(
  id: string,
  title: string,
  eventDate: string, // обязательная дата
  visibility: "public" | "friends" | "private" | "link"
) {
  const res = await fetchWithAuth(`/wishlists/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title, eventDate, visibility }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function deleteWishlist(id: string) {
    const res = await fetchWithAuth(`/wishlists/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Ошибка удаления');
    return res.json();
}

export async function getFriendWishlists(friendId: string) {
    if (!friendId) throw new Error('ID друга не указан');
    
    const res = await fetchWithAuth(`/profiles/${friendId}/wishlists`);
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Не удалось получить вишлисты друга');
    }

    return Array.isArray(data) ? data : (data.wishlists || []);
}

// Желания
export async function createWish(
  wishlistId: string,
  title: string,
  priceCategory: string,
  link?: string,
  image?: string
) {
    const res = await fetchWithAuth(`/wishlists/${wishlistId}/wishes`, {
        method: 'POST',
        body: JSON.stringify({ title, priceCategory, link, image }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка создания желания');
    return data;
}

export async function deleteWish(wishId: string) {
    const res = await fetchWithAuth(`/wishes/${wishId}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка удаления');
    return res.json();
}

export async function updateWish(wishId: string, data: any) {
    const res = await fetchWithAuth(`/wishes/${wishId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Ошибка обновления');
    return res.json();
}

export async function reserveWish(wishId: string) {
    const res = await fetchWithAuth(`/wishes/${wishId}/reserve`, {
        method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка бронирования');
    return data;
}

export async function unreserveWish(wishId: string) {
    const res = await fetchWithAuth(`/wishes/${wishId}/reserve`, {
        method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка снятия брони');
    return data;
}

export async function getMyReservations() {
    const res = await fetchWithAuth('/wishes/my-reservations');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Не удалось получить ваши брони');
    return data;
}


// ------------------- СТАТЬИ -------------------

// Получение всех статей
export async function getAllArticles() {
    const res = await fetchWithAuth('/articles');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Не удалось получить статьи');
    return data;
}

// Получение одной статьи
export async function getArticle(id: string) {
    const res = await fetchWithAuth(`/articles/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Не удалось получить статью');
    return data;
}

