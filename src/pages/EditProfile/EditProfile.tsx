import { useFriends } from '../../hooks/useFriends';
import { useParams, useNavigate } from 'react-router-dom';
import style from './EditProfile.module.scss';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { useState, useEffect } from 'react';


export default function EditProfile() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { allUsers, updateUser } = useFriends();
    const currentUserId = localStorage.getItem('currentUserId');

    // Определяем ID профиля
    const profileId = id 
        ? parseInt(id, 10) 
        : (currentUserId ? parseInt(currentUserId, 10) : null);

    // Находим пользователя в allUsers
    const profileUser = profileId 
        ? allUsers.find(user => user.id === profileId) 
        : null;

    // Состояние для формы
    const [formData, setFormData] = useState({
        avatar: '',
        name: '',
        nickname: '', 
    });

    useEffect(() => {
        if (profileUser) {
            setFormData({
            avatar: profileUser.avatar,
            name: profileUser.name,
            nickname: profileUser.nickname.replace('@', ''),
            });
        }
    }, [profileUser]);

    // const isMyProfile = currentUserId && profileId === parseInt(currentUserId, 10);

    // useEffect(() => {
    // if (!isMyProfile) {
    //     navigate('/profile');
    // }
    // }, [isMyProfile, navigate]);

    // Состояние для подтверждения удаления
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    if (!profileUser) {
        return (
        <div className={style.EditProfile}>
            <Header />
            <div className={style.container}>
            <p className={style.text}>Пользователь не найден</p>
            </div>
            <Footer />
        </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateUser(profileId!, {
            avatar: formData.avatar,
            name: formData.name,
            nickname: `@${formData.nickname}`,
        });

        navigate('/profile');
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleDeleteAccount = () => {
        setShowConfirmDelete(true);
    };

     const confirmDelete = () => {
        // Удаляем аккаунт (временно — очищаем localStorage)
        localStorage.removeItem('currentUserId');

        alert('Аккаунт удалён');
        navigate('/login');
    };

    const cancelDelete = () => {
        setShowConfirmDelete(false);
    };

    return (
        <div className={style.EditProfile}>
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
                    <button className={style.saveButton} onClick={handleSave}>Сохранить</button>
                    <button className={style.cancelButton} onClick={handleCancel}>Отмена</button>
                </div>
                <div className={style.editInformation}>
                    <input
                        className={style.input}
                        type="text"
                        name="avatar"
                        placeholder="Изменить фото"
                        value={formData.avatar}
                        onChange={handleChange}
                    />
                    <input
                        className={style.input}
                        type="text"
                        name="name"
                        placeholder="Изменить имя"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        className={style.input}
                        type="text"
                        name="nickname"
                        placeholder="Изменить ссылку @"
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                    <div className={style.deleteAccount}>
                        <p className={style.handleDeleteAccount} onClick={handleDeleteAccount}>Удалить аккаунт</p>
                    </div>
                </div>
                {showConfirmDelete && (
                <div className={style.confirmModal}>
                    <div className={style.modalContent}>
                    <p>Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.</p>
                    <div className={style.modalButtons}>
                        <button onClick={confirmDelete}>Да, удалить</button>
                        <button onClick={cancelDelete}>Отмена</button>
                    </div>
                    </div>
                </div>
                )}
            </div>
            <Footer />
        </div>
    )
}