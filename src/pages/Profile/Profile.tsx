import { useFriends } from '../../hooks/useFriends';
import { useWishlists } from '../../hooks/useWishlists';
import { useNavigate } from 'react-router-dom';
import style from './Profile.module.scss';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function Profile() {
  const { friends } = useFriends();
  const { wishlists } = useWishlists();
  const navigate = useNavigate();

return (
    <div className={style.Profile}>
        <Header />
        <div className={style.container}>
            <div className={style.profileHeader}>
            <img 
                src="/images/friendAvatar.jpg" 
                alt="Аватар" 
                className={style.avatar}
            />
            <div className={style.userInfo}>
                <h1 className={style.name}>Вероника</h1>
                <p className={style.nickname}>@teriasha</p>
            </div>
            <button 
                className={style.editButton} 
                onClick={() => navigate('/edit-profile')}
            >
                Редактировать профиль
            </button>
            </div>

            {/* Мои друзья */}
            <div className={style.information}>
                <div className={style.section}>
                    <h2 className={style.sectionTitle}>Друзья</h2>
                    <div className={style.friendsList}>
                        {friends.map(friend => (
                        <div key={friend.id} className={style.friendItem}>
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

                {/* Мои вишлисты */}
                <div className={style.section}>
                    <h2 className={style.sectionTitle}>Мои вишлисты</h2>
                    <div className={style.wishlistsList}>
                        {wishlists.map(wl => (
                        <div key={wl.id} className={style.wishlistItem}>
                            <div className={style.title}>{wl.title}</div>
                            <div className={style.date}>{wl.date}</div>
                        </div>
                        ))}
                        <button 
                        className={style.newWishlistButton}
                        onClick={() => navigate('/create-wishlist')}
                        >
                        + Новый вишлист
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
);
}