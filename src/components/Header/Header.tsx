import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Header.module.scss";
import { FaRegCircleUser } from "react-icons/fa6";
import { TbMenuDeep } from "react-icons/tb";


export const Header: FC = React.memo(() => {

    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    }

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const isAuthenticated = !!localStorage.getItem('currentUserId');

    return (
        <div className={style.Header}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt='logo'/>
                <div className={style.linkHeader} onClick={() => handleNavigation('/friends')}>Друзья</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/')}>Мои брони</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/ideas')}>Идеи подарков</div>
                
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
                <TbMenuDeep
                    className={style.menu}
                    onClick={toggleMenu}
                    aria-label="Открыть меню"
                    aria-expanded={isMenuOpen}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleMenu();
                        }
                    }}
                />
            </div>
            {isMenuOpen && (
                <div className={style.mobileMenu}>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/friends')}>Друзья</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/')}>Мои брони</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/ideas')}>Идеи подарков</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/login')}>
                        <FaRegCircleUser className={style.mobileUserIcon} />
                        Вход/Регистрация
                    </div>
                </div>
            )}
        </div>
    )
});

Header.displayName = 'Header';