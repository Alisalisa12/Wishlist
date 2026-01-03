import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Header.module.scss";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbMenuDeep } from "react-icons/tb";


export const Header: FC = () => {

    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    }

    const isAuthenticated = !!localStorage.getItem('currentUserId');


    return (
        <div className={style.Header}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt='logo'/>
                <div className={style.linkHeader} onClick={() => handleNavigation('/friends')}>Друзья</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Мои брони</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Идеи подарков</div>

                {isAuthenticated ? (
                <div className={style.profileBlock} onClick={() => handleNavigation('/profile')}>
                    <FaRegCircleUser className={style.userLogo} />
                    <div className={style.linkHeader}>Мой профиль</div>
                </div>
                ) : ( 
                    <div className={style.userBlock}>
                    <FaRegCircleUser className={style.userLogo} />
                    <div className={style.logIn} onClick={() => handleNavigation('/login')}>Вход/Регистрация</div>
                </div>
                )}

                <TbMenuDeep className={style.menu}/>
            </div>
        </div>
    )
}