export interface User {
    id: number;
    avatar: string;
    name: string;
    nickname: string;
    profileLink: string;
}

export const ALL_USERS: User[] = [
    { id: 1, avatar: 'images/friendAvatar.jpg', name: 'Вероника', nickname: '@teriasha', profileLink: '/profile/1' },
    { id: 2, avatar: 'images/friendAvatar.jpg', name: 'Карина', nickname: '@tralalero', profileLink: '/profile/2' },
    { id: 3, avatar: 'images/friendAvatar.jpg', name: 'Ира', nickname: '@tralala', profileLink: '/profile/3' },
    { id: 4, avatar: 'images/friendAvatar.jpg', name: 'Анна', nickname: '@anna', profileLink: '/profile/4' },
    { id: 5, avatar: 'images/friendAvatar.jpg', name: 'Слава', nickname: '@slaava', profileLink: '/profile/5' },
];

export const findUserByLogin = (login: string) => {
    return ALL_USERS.find(user => user.nickname === `@${login}` || user.name === login);
};

export const findUserById = (id: number) => {
    return ALL_USERS.find(user => user.id === id);
};

export const getNextId = () => {
    return Math.max(...ALL_USERS.map(u => u.id)) + 1;
};