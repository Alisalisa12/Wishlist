import { useState } from "react";
import style from "./Friends.module.scss";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { useFriends } from "../../hooks/useFriends";
import { AiFillDelete } from "react-icons/ai";

export default function FriendsPage() {
    type ViewMode = "friends" | "add" | "delete";
    const [viewMode, setViewMode] = useState<ViewMode>("friends");
    const [searchTerm, setSearchTerm] = useState("");

    const {
        friends,
        usersToAdd,
        incomingRequests,
        searchUsers,
        addFriend,
        acceptRequest,
        declineRequest,
        removeFriend,
        loading,
    } = useFriends();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        if (viewMode === "add") searchUsers(val);
    };

    const filteredFriends = friends.filter(
        (f) =>
            f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const combinedUsers = [...incomingRequests, ...usersToAdd].filter(
        (u) =>
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddMode = () => setViewMode("add");
    const handleDeleteMode = () => setViewMode("delete");
    const handleReturn = () => setViewMode("friends");

    return (
        <div className={style.Friends}>
            <Header />
            <div className={style.container}>
                <div className={style.search}>
                    <input
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={style.searchInput}
                    />
                </div>

                <div className={style.friendsList}>
                    {loading && (

                        <div style={{ minHeight: '60vh' }} aria-busy="true" aria-live="polite" />
                    )}

                    {/* Просмотр друзей */}
                    {viewMode === "friends" && !loading && (
                        <>
                            {filteredFriends.length ? (
                                filteredFriends.map((friend) => (
                                    <div key={friend.id} className={style.friendItem}>
                                        <img
                                            src={friend.avatarUrl}
                                            alt={friend.fullName}
                                            className={style.friendAvatar}
                                            onError={(e) =>
                                            ((e.currentTarget as HTMLImageElement).src =
                                                "/images/friendAvatar.jpg")
                                            }
                                        />
                                        <div className={style.friendInfo}>
                                            <div className={style.friendName}>{friend.fullName}</div>
                                            <div className={style.friendNickname}>{friend.username}</div>
                                        </div>
                                        <a href={`/profile/${friend.id}`} className={style.profileLink}>
                                            Перейти в профиль
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
                                <button className={style.deleteButton} onClick={handleDeleteMode}>
                                    - Удалить друзей
                                </button>
                            </div>
                        </>
                    )}

                    {viewMode === "add" && !loading && (
                        <>
                            {combinedUsers.length ? (
                                combinedUsers.map((user) => {
                                    const isIncoming = incomingRequests.some((r) => r.id === user.id);
                                    return (
                                        <div key={user.id} className={style.friendItem}>
                                            <img
                                                src={user.avatarUrl}
                                                alt={user.fullName}
                                                className={style.friendAvatar}
                                                onError={(e) =>
                                                ((e.currentTarget as HTMLImageElement).src =
                                                    "/images/friendAvatar.jpg")
                                                }
                                            />
                                            <div className={style.friendInfo}>
                                                <div className={style.friendName}>{user.fullName}</div>
                                                <div className={style.friendNickname}>{user.username}</div>
                                            </div>

                                            {isIncoming ? (
                                                <div className={style.incomingButtons}>
                                                    <button
                                                        className={style.addIcon}
                                                        onClick={() => acceptRequest(user)}
                                                    >
                                                        Принять
                                                    </button>
                                                    <button
                                                        className={style.addIcon}
                                                        onClick={() => declineRequest(user.id)}
                                                    >
                                                        Отклонить
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className={style.addIcon}
                                                    onClick={() => addFriend(user)}
                                                >
                                                    Добавить
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className={style.noResults}>Нет пользователей для добавления</p>
                            )}
                            <button className={style.returnButton} onClick={handleReturn}>
                                Вернуться
                            </button>
                        </>
                    )}

                    {/* Удаление друзей */}
                    {viewMode === "delete" && !loading && (
                        <>
                            {filteredFriends.length ? (
                                filteredFriends.map((friend) => (
                                    <div key={friend.id} className={style.friendItem}>
                                        <img
                                            src={friend.avatarUrl}
                                            alt={friend.fullName}
                                            className={style.friendAvatar}
                                            onError={(e) =>
                                            ((e.currentTarget as HTMLImageElement).src =
                                                "/images/friendAvatar.jpg")
                                            }
                                        />
                                        <div className={style.friendInfo}>
                                            <div className={style.friendName}>{friend.fullName}</div>
                                            <div className={style.friendNickname}>{friend.username}</div>
                                        </div>
                                        <button
                                            className={style.deleteIcon}
                                            onClick={() => removeFriend(friend.id)}
                                            aria-label={`Удалить ${friend.fullName}`}
                                        >
                                            <AiFillDelete />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className={style.noResults}>Нет друзей для удаления</p>
                            )}
                            <button className={style.returnButton} onClick={handleReturn}>
                                Вернуться
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}