// import { useState, useEffect } from "react";
// import * as api from "../services/friends.api";

// export interface Friend {
//   id: string;
//   avatarUrl: string;
//   fullName: string;
//   username: string;
//   profileLink: string;
// }

// export const useFriends = () => {
//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [usersToAdd, setUsersToAdd] = useState<Friend[]>([]);
//   const [incomingRequests, setIncomingRequests] = useState<Friend[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     api.getFriendsList()
//       .then(data =>
//         setFriends(data.friends.map((f: any) => ({
//           id: f._id,
//           fullName: f.fullName,
//           username: f.username,
//           avatarUrl: f.avatarUrl || "/images/friendAvatar.jpg",
//           profileLink: `/friends/${f._id}`,
//         })))
//       )
//       .finally(() => setLoading(false));
//   }, []);

//   const searchUsers = async (query: string) => {
//     setLoading(true);
//     const users = await api.searchUsers(query);
//     setUsersToAdd(users.map((u: any) => ({
//       id: u._id,
//       fullName: u.fullName,
//       username: u.username,
//       avatarUrl: u.avatarUrl || "/images/friendAvatar.jpg",
//       profileLink: `/friends/${u._id}`,
//     })));
//     setLoading(false);
//   };

//   const addFriend = async (user: Friend) => {
//     await api.sendFriendRequest(user.id);
//     setUsersToAdd(prev => prev.filter(u => u.id !== user.id));
//   };

//   const acceptRequest = async (user: Friend) => {
//     await api.acceptFriendRequest(user.id);
//     setFriends(prev => [...prev, user]);
//     setIncomingRequests(prev => prev.filter(r => r.id !== user.id));
//   };

//   const declineRequest = async (id: string) => {
//     await api.declineFriendRequest(id);
//     setIncomingRequests(prev => prev.filter(r => r.id !== id));
//   };

//   const removeFriend = async (id: string) => {
//     await api.removeFriend(id);
//     setFriends(prev => prev.filter(f => f.id !== id));
//   };

//   return {
//     friends,
//     usersToAdd,
//     incomingRequests,
//     searchUsers,
//     addFriend,
//     acceptRequest,
//     declineRequest,
//     removeFriend,
//     loading,
//   };
// };

import { useState, useEffect } from "react";
import * as api from "../services/friends.api";

// Интерфейс Friend уже используем
export interface Friend {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  profileLink?: string;
}

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [usersToAdd, setUsersToAdd] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  // Маппинг данных с бекенда на интерфейс Friend
  const mapFriend = (f: any): Friend => ({
    id: f._id,
    fullName: f.fullName,
    username: f.username,
    avatarUrl: f.avatarUrl,
    profileLink: f.profileLink,
  });

  // Инициализация: загрузка друзей и входящих заявок
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { friends: backendFriends } = await api.getFriendsList();
        setFriends(backendFriends.map(mapFriend));

        const { incomingRequests } = await api.getIncomingFriendRequests();
        setIncomingRequests(incomingRequests.map(mapFriend));
      } catch (err) {
        console.error("Ошибка загрузки друзей:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Поиск пользователей для добавления
  const searchUsers = async (query: string) => {
    setLoading(true);
    try {
      const users = await api.searchUsers(query);
      setUsersToAdd(users.map(mapFriend));
    } catch (err) {
      console.error("Ошибка поиска пользователей:", err);
    } finally {
      setLoading(false);
    }
  };

  // Отправка запроса в друзья
  const addFriend = async (user: Friend) => {
    try {
      await api.sendFriendRequest(user.id);
      // удаляем из usersToAdd, оставляем в friends после принятия запроса
      setUsersToAdd(prev => prev.filter(u => u.id !== user.id));
    } catch (err) {
      console.error("Ошибка отправки запроса:", err);
    }
  };

  // Принятие входящего запроса
  const acceptRequest = async (user: Friend) => {
    try {
      await api.acceptFriendRequest(user.id);
      setFriends(prev => [...prev, user]);
      setIncomingRequests(prev => prev.filter(r => r.id !== user.id));
    } catch (err) {
      console.error("Ошибка принятия запроса:", err);
    }
  };

  // Отклонение входящего запроса
  const declineRequest = async (userId: string) => {
    try {
      await api.declineFriendRequest(userId);
      setIncomingRequests(prev => prev.filter(r => r.id !== userId));
    } catch (err) {
      console.error("Ошибка отклонения запроса:", err);
    }
  };

  // Удаление друга
  const removeFriend = async (userId: string) => {
    try {
      await api.removeFriend(userId);
      setFriends(prev => prev.filter(f => f.id !== userId));
    } catch (err) {
      console.error("Ошибка удаления друга:", err);
    }
  };

  return {
    friends,
    usersToAdd,
    incomingRequests,
    loading,
    searchUsers,
    addFriend,
    acceptRequest,
    declineRequest,
    removeFriend,
  };
};