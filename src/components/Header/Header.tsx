import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Header.module.scss";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";


export const Header: FC = () => {

    const navigate = useNavigate();
        const handleNavigation = (path: string) => {
            navigate(path);
        }

    return (
        <div className={style.Header}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt='logo'/>
                <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Друзья</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Мои брони</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Идеи подарков</div>
                <div className={style.searchBlock}>
                    <CiSearch className={style.searchLogo} />
                    <p className={style.searchText}>Поиск</p>
                </div>
                <div className={style.userBlock}>
                    <FaRegCircleUser className={style.userLogo} />
                    <p className={style.userText}>Вход/Регистрация</p>
                </div>
            </div>
        </div>
    )
}