import style from "./Friends.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";


interface FriendProps {
    id: number;
    avatar: string;
    name: string;
    nickname: string;
    profileLink: string; // Ссылка на профиль (например, "/profile/123")
}

export default function Friends() {
    type ViewMode = "friends" | "add" | "delete";
    const [viewMode, setViewMode] = useState<ViewMode>("friends");

    // const navigate = useNavigate();
    // const handleNavigation = (path: string) => {
    //     navigate(path);
    // };

    const [friends, setFriends] = useState<FriendProps[]>([
        {
        id: 1,
        avatar: "images/friendAvatar.jpg",
        name: "Вероника",
        nickname: "@teriasha",
        profileLink: "/profile/teriasha",
        },
        {
        id: 2,
        avatar: "images/friendAvatar.jpg",
        name: "Карина",
        nickname: "@tralalero",
        profileLink: "/profile/tralalero",
        },
        {
        id: 3,
        avatar: "images/friendAvatar.jpg",
        name: "Ира",
        nickname: "@tralala",
        profileLink: "/profile/tralala",
        },
    ]);

    const allUsers: FriendProps[] = [
        ...friends,
        {
        id: 4,
        avatar: "images/friendAvatar.jpg",
        name: "Анна",
        nickname: "@anna9",
        profileLink: "/profile/anna9",
        },
        {
        id: 5,
        avatar: "images/friendAvatar.jpg",
        name: "Слава",
        nickname: "@slaava",
        profileLink: "/profile/slaava",
        },
    ];

    const handleAddMode = () => setViewMode("add");
    const handleDeleteMode = () => setViewMode("delete");
    const handleReturn = () => setViewMode("friends");

    const handleAddFriend = (user: FriendProps) => {
        if (!friends.some((f) => f.id === user.id)) {
        setFriends((prev) => [...prev, user]);
        }
    };

    const handleRemoveFriend = (id: number) => {
        setFriends((prev) => prev.filter((f) => f.id !== id));
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredFriends = friends.filter(
        (friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Пользователи для добавления (исключаем уже друзей)
    const usersToAdd = allUsers.filter(
        (user) => !friends.some((friend) => friend.id === user.id)
    );

    const filteredUsersToAdd = usersToAdd.filter(
        (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className={style.Friends}>
        <Header />
        <div className={style.container}>
            <div className={style.search}>
            <input
                type="text"
                placeholder="Поиск"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={style.searchInput}
            />
            </div>
            <div className={style.friendsList}>
                {viewMode === "friends" && (
                    <>
                    {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                        <div key={friend.id} className={style.friendItem}>
                            <img
                            src={friend.avatar}
                            alt={`${friend.name}'s avatar`}
                            className={style.friendAvatar}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                "images/friendAvatar.jpg";
                            }}
                            />
                            <div className={style.friendInfo}>
                                <div className={style.friendName}>{friend.name}</div>
                                <div className={style.friendNickname}>
                                    {friend.nickname}
                                </div>
                            </div>
                            <a href={friend.profileLink} className={style.profileLink}>
                            перейти в профиль
                            </a>
                        </div>
                        ))
                    ) : (
                        <p className={style.noResults}>Друзей не найдено</p>
                    )}

                    <div className={style.buttons}>
                        <button className={style.addButton} onClick={handleAddMode}>
                        + Добавить друзей
                        </button>
                        <button
                        className={style.deleteButton}
                        onClick={handleDeleteMode}
                        >
                        - Удалить друзей
                        </button>
                    </div>
                    </>
                )}

                {viewMode === "add" && (
                    <>
                    {filteredUsersToAdd.length > 0 ? (
                        filteredUsersToAdd.map((user) => (
                        <div key={user.id} className={style.friendItem}>
                            <img
                            src={user.avatar}
                            alt={`${user.name}'s avatar`}
                            className={style.friendAvatar}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                "images/friendAvatar.jpg";
                            }}
                            />
                            <div className={style.friendInfo}>
                                <div className={style.friendName}>{user.name}</div>
                                <div className={style.friendNickname}>
                                    {user.nickname}
                                </div>
                            </div>
                            <button
                            className={style.addIcon}
                            onClick={() => handleAddFriend(user)}
                            >
                            Добавить
                            </button>
                        </div>
                        ))
                    ) : (
                        <p className={style.noResults}>
                        Нет пользователей для добавления
                        </p>
                    )}
                    </>
                )}

                {viewMode === "delete" && (
                    <>
                    {filteredFriends.length > 0 ? (
                        filteredFriends.map((friend) => (
                        <div key={friend.id} className={style.friendItem}>
                            <img
                            src={friend.avatar}
                            alt={`${friend.name}'s avatar`}
                            className={style.friendAvatar}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                "images/friendAvatar.jpg";
                            }}
                            />
                            <div className={style.friendInfo}>
                                <div className={style.friendName}>{friend.name}</div>
                                <div className={style.friendNickname}>
                                    {friend.nickname}
                                </div>
                            </div>
                            <button
                            className={style.deleteIcon}
                            onClick={() => handleRemoveFriend(friend.id)}
                            aria-label={`Удалить ${friend.name}`}
                            >
                                <AiFillDelete />
                            </button>
                        </div>
                        ))
                    ) : (
                        <p className={style.noResults}>Нет друзей для удаления</p>
                    )}
                    </>
                )}
                {viewMode !== 'friends' && (
                <button className={style.returnButton} onClick={handleReturn}>
                    Вернуться
                </button>
                )}
            </div>
        </div>
        <Footer />
    </div>
    );
}
