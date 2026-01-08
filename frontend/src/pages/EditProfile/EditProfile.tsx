import style from './EditProfile.module.scss';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateProfile, removeAccount } from '../../api';

export default function EditProfile() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({ avatar: '', name: '', nickname: '' });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then(data => {
                setUser(data);
                setFormData({
                    avatar: data.avatarUrl || '',
                    name: data.fullName || '',
                    nickname: data.username?.replace('@', '') || '',
                });
            })
            .catch(err => {
                alert(err.message);
                navigate('/login');
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === 'string' ? reader.result : '';
            if (result) setFormData(prev => ({ ...prev, avatar: result }));
        };
        reader.readAsDataURL(file);
    };

    const handlePasteImage = (e: React.ClipboardEvent<HTMLDivElement>) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (!file) continue;
                const reader = new FileReader();
                reader.onload = () => {
                    const result = typeof reader.result === 'string' ? reader.result : '';
                    if (result) setFormData(prev => ({ ...prev, avatar: result }));
                };
                reader.readAsDataURL(file);
                e.preventDefault();
                break;
            }
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData.name, `@${formData.nickname}`, formData.avatar);
            alert('Профиль обновлён');
            navigate('/profile');
        } catch (err: any) {
            alert(err.message || 'Ошибка при сохранении профиля');
        }
    };

    const handleDeleteAccount = () => setShowConfirmDelete(true);
    const confirmDelete = async () => {
        try {
            await removeAccount();
            localStorage.removeItem('token');
            alert('Аккаунт удалён');
            navigate('/login');
        } catch (err: any) {
            alert(err.message || 'Не удалось удалить аккаунт');
        }
    };
    const cancelDelete = () => setShowConfirmDelete(false);
    const handleCancel = () => navigate('/profile');

    if (loading) return <p>Загрузка...</p>;
    if (!user) return <p>Пользователь не найден</p>;

    return (
        <div className={style.EditProfile} onPaste={handlePasteImage}>
            <Header />
            <div className={style.container}>
                <div className={style.profileHeader}>
                    <img
                        src={formData.avatar || '/images/friendAvatar.jpg'}
                        alt="аватар"
                        className={style.avatar}
                        onError={(e) => (e.currentTarget.src = '/images/friendAvatar.jpg')}
                    />
                    <div className={style.userInfo}>
                        <h1 className={style.name}>{formData.name}</h1>
                        <p className={style.nickname}>@{formData.nickname}</p>
                    </div>
                    <button className={style.saveButton} onClick={handleSave}>Сохранить</button>
                    <button className={style.cancelButton} onClick={handleCancel}>Отмена</button>
                </div>

                <div className={style.editInformation}>
                    <input type="file" accept="image/*" onChange={handleAvatarFile} className={style.input} />
                    <input
                        type="text"
                        name="avatar"
                        placeholder="Ссылка на фото или вставьте изображение"
                        value={formData.avatar}
                        onChange={handleChange}
                        className={style.input}
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Изменить имя"
                        value={formData.name}
                        onChange={handleChange}
                        className={style.input}
                    />
                    <input
                        type="text"
                        name="nickname"
                        placeholder="Изменить ссылку @"
                        value={formData.nickname}
                        onChange={handleChange}
                        className={style.input}
                    />
                    <div className={style.deleteAccount}>
                        <p className={style.handleDeleteAccount} onClick={handleDeleteAccount}>
                            Удалить аккаунт
                        </p>
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
    );
}
