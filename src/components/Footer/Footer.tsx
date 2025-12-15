import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Footer.module.scss";


export const Footer: FC = () => {

    const navigate = useNavigate();
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
                    <div className={style.linkHeader} onClick={() => handleNavigation('/login')}>Вход/Регистрация</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/friends')}>Друзья</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Мои брони</div>
                    <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Идеи подарков</div>
                </div>
            </div>
        </div>
    )
}