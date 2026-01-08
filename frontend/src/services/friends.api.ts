import { fetchWithAuth } from "../api";

export interface FriendData {
  _id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  profileLink?: string;
}

export interface IncomingRequestData extends FriendData {
  // можно добавить дополнительные поля, если нужны
}

export async function getFriendsList(): Promise<{ friends: FriendData[] }> {
  const res = await fetchWithAuth("/friends");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Не удалось получить друзей");
  return data; // { friends: [...] }
}

export async function getFriendProfile(friendId: string, token?: string) {
  const res = await fetchWithAuth(`/friends/${friendId}${token ? `?token=${token}` : ""}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Не удалось получить профиль друга");
  return data; // { friend, wishlists }
}

export async function getIncomingFriendRequests(): Promise<{ incomingRequests: IncomingRequestData[] }> {
  const res = await fetchWithAuth("/friends/requests");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Не удалось получить входящие заявки");
  return data;
}

export async function searchUsers(query: string): Promise<FriendData[]> {
  const res = await fetchWithAuth(`/users/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Не удалось выполнить поиск");
  return data;
}

export async function sendFriendRequest(friendId: string): Promise<void> {
  const res = await fetchWithAuth(`/friends/request/${friendId}`, { method: "POST" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Не удалось отправить запрос в друзья");
  }
}

export async function acceptFriendRequest(friendId: string): Promise<void> {
  const res = await fetchWithAuth(`/friends/accept/${friendId}`, { method: "POST" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Не удалось принять запрос");
  }
}

export async function declineFriendRequest(friendId: string): Promise<void> {
  const res = await fetchWithAuth(`/friends/decline/${friendId}`, { method: "POST" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Не удалось отклонить запрос");
  }
}


export async function removeFriend(friendId: string): Promise<void> {
  const res = await fetchWithAuth(`/friends/${friendId}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Не удалось удалить друга");
  }
}

export async function reserveWish(wishId: string) {
  const res = await fetchWithAuth(`/wishes/${wishId}/reserve`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Ошибка бронирования");
}

export async function unreserveWish(wishId: string) {
  const res = await fetchWithAuth(`/wishes/${wishId}/reserve`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Ошибка снятия брони");
}