import { useFriends } from '../../hooks/useFriends';
import { useWishlists } from '../../hooks/useWishlists';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Profile.module.scss';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import WishlistCards from '../../components/WishlistCards/WishlistCards';
import { saveCurrentWishlist, Wishlist as StorageWishlist } from '../../services/wishlistStorage';
import Button from "../../components/UI/buttons/Button";

export default function Profile() {
    const { wishlists } = useWishlists();
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();

    const { friends, allUsers } = useFriends();
    const currentUserId = localStorage.getItem('currentUserId');

    // Определяем ID профиля
    const profileId = id 
        ? parseInt(id, 10) 
        : (currentUserId ? parseInt(currentUserId, 10) : null);

    // Находим пользователя в allUsers
    const profileUser = profileId 
        ? allUsers.find(user => user.id === profileId) 
        : null;

    const isMyProfile = currentUserId ? profileId === parseInt(currentUserId, 10) : false;

    if (!profileUser) {
        return (
        <div className={style.Profile}>
            <Header />
            <div className={style.container}>
            <p className={style.text}>Пользователь не найден</p>
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
                        src={profileUser.avatar} 
                        alt='аватар' 
                        className={style.avatar}
                    />
                    <div className={style.userInfo}>
                        <h1 className={style.name}>{profileUser.name}</h1>
                        <p className={style.nickname}>{profileUser.nickname}</p>
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

                {/* Информация: секции ниже */}
                <div className={style.information}>
                    {isMyProfile && (
                        <div className={style.section}>
                            <h2 className={style.sectionTitle}>Друзья</h2>
                            <div className={style.friendsList}>
                                {friends.map(friend => (
                                <div
                                    key={friend.id}
                                    className={style.friendItem}
                                    onClick={() => navigate(friend.profileLink)}
                                    title="Перейти в профиль"
                                >
                                    <img 
                                    src={friend.avatar} 
                                    alt={friend.name} 
                                    className={style.friendAvatar}
                                    />
                                    <div className={style.friendInfo}>
                                    <div className={style.friendName}>{friend.name}</div>
                                    <div className={style.friendNickname}>{friend.nickname}</div>
                                    </div>
                                </div>
                                ))}
                                <button 
                                className={style.addFriendButton}
                                onClick={() => navigate('/friends')}
                                >
                                + Добавить друзей
                                </button>
                            </div>
                        </div>
                    )}

                        {/* Вишлисты пользователя */}
                    <div className={style.section}>
                        <h2 className={style.sectionTitle}>
                            {isMyProfile ? 'Мои вишлисты' : ''}
                        </h2>
                        <WishlistCards
                            wishlists={wishlists as unknown as StorageWishlist[]}
                            onOpen={(w) => {
                                // Сохраняем выбранный вишлист как текущий
                                saveCurrentWishlist(w as StorageWishlist);
                                // В своём профиле открываем владелецкий вид с полным функционалом
                                if (isMyProfile) {
                                    navigate('/wishlist');
                                    return;
                                }
                                // В профиле друга — открываем публичный просмотр по id
                                const idPart = (w as StorageWishlist).id != null ? `/${(w as StorageWishlist).id}` : '';
                                navigate(`/friend-wishlist${idPart}`);
                            }}
                        />
                        {isMyProfile && (
                            <Button
                                className={style.newWishlistButton}
                                onClick={() => navigate('/create')}
                            >
                                + Новый вишлист
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}