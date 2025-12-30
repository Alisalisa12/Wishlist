import { useState, useEffect } from 'react';

export interface Friend {
    id: number;
    avatar: string;
    name: string;
    nickname: string;
    profileLink: string;
}

// Статичные данные (временно, для разработки)
const ALL_USERS_MOCK: Friend[] = [
    { id: 1, avatar: 'images/friendAvatar.jpg', name: 'Вероника', nickname: '@teriasha', profileLink: '/profile/1' },
    { id: 2, avatar: 'images/friendAvatar.jpg', name: 'Карина', nickname: '@tralalero', profileLink: '/profile/2' },
    { id: 3, avatar: 'images/friendAvatar.jpg', name: 'Ира', nickname: '@tralala', profileLink: '/profile/3' },
    { id: 4, avatar: 'images/friendAvatar.jpg', name: 'Анна', nickname: '@anna', profileLink: '/profile/4' },
    { id: 5, avatar: 'images/friendAvatar.jpg', name: 'Слава', nickname: '@slaava', profileLink: '/profile/5' },
];

const INITIAL_FRIEND_IDS = new Set([1, 2, 3]);

export const useFriends = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [allUsers] = useState<Friend[]>(ALL_USERS_MOCK); // не меняется

    // Инициализация
    useEffect(() => {
        const initial = allUsers.filter(u => INITIAL_FRIEND_IDS.has(u.id));
        setFriends(initial);
    }, [allUsers]);

    const addFriend = (user: Friend) => {
        setFriends(prev => [...prev, user]);
    };

    const removeFriend = (id: number) => {
        setFriends(prev => prev.filter(f => f.id !== id));
    };

    const usersToAdd = allUsers.filter(
        user => !friends.some(f => f.id === user.id)
    );

    return {
        friends,
        allUsers,
        usersToAdd,
        addFriend,
        removeFriend,
    };
};