import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./Header.module.scss";
import { TbMenuDeep } from "react-icons/tb";
import { useAuth } from '../../context/AuthContext'; 

interface HeaderProps {
    isAuth?: boolean;
    setIsAuth?: (value: boolean) => void;
}

export const Header: FC<HeaderProps> = React.memo(() => {
    const { isAuth, setIsAuth } = useAuth(); 
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
    }

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
        navigate('/home');
    };

    return (
        <div className={style.Header}>
            <div className={style.container}>
                <img 
                    src="/images/logo.png" 
                    className={style.logo} 
                    alt='logo' 
                    onClick={() => navigate('/home')} 
                    style={{cursor: 'pointer'}}
                />
                <div className={style.linkHeader} onClick={() => handleNavigation('/friends')}>Друзья</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/reservations')}>Мои брони</div>
                <div className={style.linkHeader} onClick={() => handleNavigation('/ideas')}>Идеи подарков</div>
                
                {isAuth ? (
                    <div className={style.profileBlock}>
                        <div className={style.userRow} onClick={() => handleNavigation('/profile')}>
                            <div className={style.linkHeader}>Профиль</div>
                        </div>
                        <div className={style.logIn} style={{marginLeft: '45px'}} onClick={handleLogout}>Выйти</div>
                    </div>

                ) : (
                    <div className={style.userBlock} onClick={() => handleNavigation('/login')}>
                        <div className={style.logIn}>Вход/Регистрация</div>
                    </div>
                )}
                
                <TbMenuDeep
                    className={style.menu}
                    onClick={toggleMenu}
                    aria-label="Открыть меню"
                />
            </div>
            
            {isMenuOpen && (
                <div className={style.mobileMenu}>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/friends')}>Друзья</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/emptywishlist')}>Мои вишлисты</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/reservations')}>Мои брони</div>
                    <div className={style.mobileMenuItem} onClick={() => handleNavigation('/ideas')}>Идеи подарков</div>
                    
                    {isAuth ? (
                        <div>
                            <div className={style.mobileMenuItem} onClick={() => handleNavigation('/profile')}>Мой профиль</div>
                            <div className={style.logIn} style={{marginLeft: '20px', marginBottom: '10px'}} onClick={handleLogout}>Выйти</div>
                        </div>
                    ) : (
                        <div className={style.mobileMenuItem} onClick={() => handleNavigation('/login')}>Вход/Регистрация</div>
                    )}
                </div>
            )}
        </div>
    )
});

Header.displayName = 'Header';