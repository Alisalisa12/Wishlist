import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Footer.module.scss";
import {useAuth} from "../../context/AuthContext";


export const Footer: FC = () => {
    const { isAuth, setIsAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
        navigate('/home');
    };
    const handleNavigation = (path: string) => {
            navigate(path);
        }
    return (
        <div className={style.Footer}>
            <div className={style.container}>
                <div className={style.describe}>
                    <img src="/images/logo.png" className={style.logo} alt='logo'/>
                    <p className={style.text}>Политика конфиденциальности</p>
                    <p className={style.text}>Условия пользования</p>
                </div>
                <div className={style.navigate}>
                    {isAuth ? (
                        <div className={style.profileBlock} onClick={() => handleNavigation('/profile')}>
                            <div className={style.linkHeader}>Мой профиль</div>
                            <div className={style.logIn} style={{marginTop: '5px'}} onClick={handleLogout}>Выйти</div>
                        </div>
                    ) : (
                        <div className={style.userBlock}>
                            <div className={style.logIn} onClick={() => handleNavigation('/login')}>Вход/Регистрация</div>
                        </div>
                    )}
                    <div className={style.linkHeader} onClick={() => handleNavigation('/friends')}>Друзья</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/reservations')}>Мои брони</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/ideas')}>Идеи подарков</div>
                </div>
            </div>
        </div>
    )
}