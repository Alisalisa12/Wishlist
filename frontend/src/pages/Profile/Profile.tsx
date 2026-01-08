import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Profile.module.scss';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import WishlistCards from '../../components/WishlistCards/WishlistCards';
import Button from "../../components/UI/buttons/Button";
import {
    getCurrentUser,
    getMyWishlists,
} from '../../api';
import {
    getFriendsList,
    getFriendProfile,
} from "../../services/friends.api";

interface User {
    _id: string;
    fullName: string;
    username: string;
    avatarUrl?: string;
}

export default function Profile() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [wishlists, setWishlists] = useState<any[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const isMyProfile = !id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (isMyProfile) {
                    // Свой профиль
                    const [currentUser, myWishlistsResponse, myFriendsResponse] = await Promise.all([
                        getCurrentUser(),
                        getMyWishlists(),
                        getFriendsList()
                    ]);

                    setUser(currentUser);
                    setWishlists(Array.isArray(myWishlistsResponse) ? myWishlistsResponse : []);

                    const myFriendsArray = Array.isArray(myFriendsResponse?.friends)
                        ? myFriendsResponse.friends
                        : [];
                    setFriends(myFriendsArray);

                } else if (id) {
                    // Чужой профиль
                    const data = await getFriendProfile(id);
                    const friend = data.friend;
                    const friendWishlists = Array.isArray(data.wishlists) ? data.wishlists : [];


                    const mappedFriend: User = {
                        _id: friend._id,
                        fullName: friend.fullName || "Пользователь",
                        username: friend.username || "unknown",
                        avatarUrl: friend.avatarUrl || '/images/default-avatar.png'
                    };
                    setUser(mappedFriend);
                    setWishlists(friendWishlists);
                    setFriends([]);
                }
            } catch (err) {
                console.error("Ошибка загрузки профиля:", err);
                setUser(null);
                setFriends([]);
                setWishlists([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isMyProfile]);

    const handleOpenWishlist = (wishlistId: string) => {
        navigate(`/wishlist/${wishlistId}`);
    };

    if (loading) {
        return (
            <div className={style.Profile}>
                <Header />
                <div className={style.container}>
                    {}
                    <div style={{ minHeight: '60vh' }} aria-busy="true" aria-live="polite" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className={style.Profile}>
                <Header />
                <div className={style.container}>
                    <p>Пользователь не найден</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={style.Profile}>
            <Header />
            <div className={style.container}>
                <div className={style.profileHeader}>
                    <img
                        src={user.avatarUrl || '/images/default-avatar.png'}
                        alt='аватар'
                        className={style.avatar}
                    />
                    <div className={style.userInfo}>
                        <h1 className={style.name}>{user.fullName}</h1>
                        {(() => {
                            const uname = (user.username || "").replace(/^@+/, "");
                            return (
                                <p className={style.nickname}>{uname ? `@${uname}` : ""}</p>
                            );
                        })()}
                    </div>
                    {isMyProfile && (
                        <button
                            className={style.editButton}
                            onClick={() => navigate('/editprofile')}
                        >
                            Редактировать профиль
                        </button>
                    )}
                </div>

                <div className={style.information}>
                    {isMyProfile && (
                        <div className={style.section}>
                            <h2 className={style.sectionTitle}>Друзья ({friends.length})</h2>
                            <div className={style.friendsList}>
                                {Array.isArray(friends) && friends.length > 0 ? (
                                    friends.map(friend => (
                                        <div
                                            key={friend._id}
                                            className={style.friendItem}
                                            onClick={() => navigate(`/profile/${friend._id}`)}
                                        >
                                            <img
                                                src={friend.avatarUrl || '/images/default-avatar.png'}
                                                alt=""
                                                className={style.friendAvatar}
                                            />
                                            <div className={style.friendName}>{friend.fullName}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={style.emptyText}>У вас пока нет друзей</p>
                                )}
                                <button
                                    className={style.addFriendButton}
                                    onClick={() => navigate('/friends')}
                                >
                                    + Найти друзей
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={style.section}>
                        <h2 className={style.sectionTitle}>
                            {isMyProfile
                                ? 'Мои вишлисты'
                                : `Вишлисты пользователя ${user.fullName}`}
                        </h2>

                        <WishlistCards
                            wishlists={wishlists}
                            onOpen={handleOpenWishlist}
                        />

                        {isMyProfile && (
                            <Button
                                className={style.newWishlistButton}
                                onClick={() => navigate('/create')}
                            >
                                + Создать новый вишлист
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
