import { useState, useEffect } from 'react';

export interface Friend {
    id: number;
    avatar: string;
    name: string;
    nickname: string;
    profileLink: string;
}

// Статичные данные (по умолчанию, для первичной инициализации)
const ALL_USERS_MOCK: Friend[] = [
    { id: 1, avatar: '/images/friendAvatar.jpg', name: 'Вероника', nickname: '@teriasha', profileLink: '/profile/1' },
    { id: 2, avatar: '/images/friendAvatar.jpg', name: 'Карина', nickname: '@tralalero', profileLink: '/profile/2' },
    { id: 3, avatar: '/images/friendAvatar.jpg', name: 'Ира', nickname: '@tralala', profileLink: '/profile/3' },
    { id: 4, avatar: '/images/friendAvatar.jpg', name: 'Анна', nickname: '@anna', profileLink: '/profile/4' },
    { id: 5, avatar: '/images/friendAvatar.jpg', name: 'Слава', nickname: '@slaava', profileLink: '/profile/5' },
];

const INITIAL_FRIEND_IDS = new Set([1, 2, 3]);

export const useFriends = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [allUsers, setAllUsers] = useState<Friend[]>(ALL_USERS_MOCK);

    const ALL_USERS_KEY = 'friends:allUsers';
    const FRIEND_IDS_KEY = 'friends:friendIds';

    // Инициализация: читаем из localStorage, при отсутствии — сеем мок-данные
    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem(ALL_USERS_KEY);
            const parsedUsers: Friend[] | null = storedUsers ? JSON.parse(storedUsers) : null;
            const users = Array.isArray(parsedUsers) && parsedUsers.length > 0 ? parsedUsers : ALL_USERS_MOCK;

            if (!parsedUsers) {
                localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
            }

            setAllUsers(users);

            const storedFriendIds = localStorage.getItem(FRIEND_IDS_KEY);
            const parsedIds: number[] | null = storedFriendIds ? JSON.parse(storedFriendIds) : null;
            const ids = Array.isArray(parsedIds) && parsedIds.length > 0
                ? new Set(parsedIds)
                : new Set(Array.from(INITIAL_FRIEND_IDS));

            if (!parsedIds) {
                localStorage.setItem(FRIEND_IDS_KEY, JSON.stringify(Array.from(ids)));
            }

            const initialFriends = users.filter(u => ids.has(u.id));
            setFriends(initialFriends);
        } catch (e) {
            // В случае ошибки — безопасный откат к мок-данным
            setAllUsers(ALL_USERS_MOCK);
            setFriends(ALL_USERS_MOCK.filter(u => INITIAL_FRIEND_IDS.has(u.id)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const persistAllUsers = (users: Friend[]) => {
        try {
            localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
        } catch { /* ignore */ }
    };

    const persistFriendIds = (ids: number[]) => {
        try {
            localStorage.setItem(FRIEND_IDS_KEY, JSON.stringify(ids));
        } catch { /* ignore */ }
    };

    const updateUser = (id: number, updates: Partial<Friend>) => {
        setAllUsers(prev => {
            const next = prev.map(user => user.id === id ? { ...user, ...updates } : user);
            persistAllUsers(next);
            // если обновляемый пользователь есть среди друзей — обновим friends для немедленного отображения
            setFriends(cur => cur.map(f => f.id === id ? { ...f, ...updates } : f));
            return next;
        });
    };

    const addFriend = (user: Friend) => {
        setFriends(prev => {
            if (prev.some(f => f.id === user.id)) return prev;
            const next = [...prev, user];
            // обновим ids в localStorage
            persistFriendIds(next.map(f => f.id));
            return next;
        });
    };

    const removeFriend = (id: number) => {
        setFriends(prev => {
            const next = prev.filter(f => f.id !== id);
            persistFriendIds(next.map(f => f.id));
            return next;
        });
    };

    const usersToAdd = allUsers.filter(
        user => !friends.some(f => f.id === user.id)
    );

    return {
        friends,
        allUsers,
        usersToAdd: allUsers.filter(user => !friends.some(f => f.id === user.id)),
        addFriend,
        removeFriend,
        updateUser,
    };
};