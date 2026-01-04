import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Footer.module.scss";
import {FaRegCircleUser} from "react-icons/fa6";
import { Link } from 'react-router-dom';


export const Footer: FC = () => {

    const navigate = useNavigate();
        const handleNavigation = (path: string) => {
            navigate(path);
        }
    const isAuthenticated = !!localStorage.getItem('currentUserId');
    return (
        <div className={style.Footer}>
            <div className={style.container}>
                <div className={style.describe}>
                    <img src="/images/logo.png" className={style.logo} alt='logo'/>
                    <Link to="/privacy" className={style.inlineLink}>
                        Политика конфиденциальности
                    </Link>
                    <Link to="/terms" className={style.inlineLink}>
                        Условия пользования
                    </Link>
                </div>
                <div className={style.navigate}>
                    {isAuthenticated ? (
                        <div className={style.profileBlock} onClick={() => handleNavigation('/profile')}>
                            <FaRegCircleUser className={style.userLogo} />
                            <div className={style.linkHeader}>Мой профиль</div>
                        </div>
                    ) : (
                        <div className={style.userBlock}>
                            <FaRegCircleUser className={style.userLogo} />
                            <div className={style.linkHeader} onClick={() => handleNavigation('/login')}>Вход/Регистрация</div>
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