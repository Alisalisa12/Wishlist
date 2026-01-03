import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import style from './Registration.module.scss';
import { Input } from '../../components/Input/Input';
import { ALL_USERS, getNextId } from '../../data/users';


const NAME_REGEX = /^[a-zA-ZА-яёЁ\s\-']{1,64}$/;
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,64}\.[^\s@]{2,10}$/;
const LOGIN_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

export default function Registration() {

    const [ name, setName ] = useState('');
    const [ isErrorName, setErrorName ] = useState(false);    
    const handleChangeName = (value: string) => {        
        setName(value);
    };

    const [ email, setEmail ] = useState('');
    const [ isErrorEmail, setErrorEmail ] = useState(false);
    const handleChangeEmail = (value: string) => {
        setEmail(value);
    }

    const [ login, setLogin ] = useState('');
    const [ isErrorLogin, setErrorLogin ] = useState(false);
    const handleChangeLogin = (value: string) => {
        setLogin(value);
    }

    const [isLoginUnique, setIsLoginUnique] = useState(true);

    const [ password, setPassword ] = useState('');
    const [ isErrorPassword, setErrorPassword ] = useState(false);
    const handleChangePassword = (value: string) => {
        setPassword(value);
    }

    const [ repeatPassword, setRepeatPassword ] = useState('');
    const [ isErrorRepeatPassword, setErrorRepeatPassword ] = useState(false);
    const handleChangeRepeatPassword = (value: string) => {
        setRepeatPassword(value);
    }

    const navigate = useNavigate();
    const handleNavigation = (path: string) => {
        navigate(path);
    }

    useEffect(() => {
        if (login.trim() && LOGIN_REGEX.test(login.trim())) {
            const check = async () => {
            // Имитация API
            const response = await fetch(`/api/check-login?login=${encodeURIComponent(login.trim())}`);
            const data = await response.json();
            setIsLoginUnique(data.isUnique);
            };
            const timer = setTimeout(check, 500);
            return () => clearTimeout(timer);
        } else {
            setIsLoginUnique(true); // сброс при некорректном вводе
        }
    }, [login]);

    const handleSubmit = () => {
        setErrorName(false);
        setErrorEmail(false);
        setErrorLogin(false);
        setErrorPassword(false);
        setErrorRepeatPassword(false);

        let hasError = false;

        if (!name.trim() || !NAME_REGEX.test(name.trim())) {
            setErrorName(true);
            hasError = true;
        }

        if (!email || !EMAIL_REGEX.test(email)) {
            setErrorEmail(true);
            hasError = true;
        }

        if (!login || !LOGIN_REGEX.test(login)) {
            setErrorLogin(true);
            hasError = true;
        }

        if (!password || !PASSWORD_REGEX.test(password)) {
            setErrorPassword(true);
            hasError = true;
        }

        if (!repeatPassword || password !== repeatPassword) {
            setErrorRepeatPassword(true);
            hasError = true;
        }

        if (!hasError) {
            // await api.register({ name, email, password });

            // Проверяем, занят ли логин
            const loginExists = ALL_USERS.some(user => 
                user.nickname === `@${login.trim()}` || user.name === login.trim()
            );

            if (loginExists) {
                setErrorLogin(true);
                return;
            }

            // Создаём нового пользователя
            const newId = getNextId();
            const newUser = {
                id: newId,
                avatar: 'images/friendAvatar.jpg',
                name: name.trim(),
                nickname: `@${login.trim()}`,
                profileLink: `/profile/${newId}`,
            };

            // Добавляем в список (временно, только для фронта)
            console.log('Новый пользователь:', newUser);

            // Сохраняем
            localStorage.setItem('currentUserId', String(newId));
            navigate('/profile');
        }
    };
    

    return (
        <div className={style.Registration}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt='logo'/>
                <div className={style.form}>
                    <p className={style.title}>Регистрация</p>
                    <Input 
                        type="text"
                        name="username"
                        placeholder="Имя"
                        value={name}
                        handleChange={handleChangeName}
                    />
                    {isErrorName && (
                        <div className={style.errorMessage}>
                            Имя: 1–64 символа, только буквы, пробелы, дефисы
                        </div>
                    )}
                    <Input 
                        type="email"
                        name="email"
                        placeholder="Почта"
                        value={email}
                        handleChange={handleChangeEmail}
                    />
                    {isErrorEmail && (
                        <div className={style.errorMessage}>
                            Неккоректный ввод email
                        </div>
                    )}
                    <Input 
                        type="text"
                        name="login"
                        placeholder="Логин"
                        value={login}
                        handleChange={handleChangeLogin}
                    />
                    {isErrorLogin && (
                        <div className={style.errorMessage}>
                            Логин: 3–20 символов, латиница, цифры, _ или -
                        </div>
                    )}
                    {login && !isLoginUnique && (
                        <div className={style.errorMessage}>
                            Логин уже занят
                        </div>
                    )}
                    <Input 
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        handleChange={handleChangePassword}
                    />
                    {isErrorPassword && (
                        <div className={style.errorMessage}>
                            Пароль: 8–64 символов, заглавная буква, цифра, спецсимвол
                        </div>
                    )}
                    <Input 
                        type="password"
                        name="password"
                        placeholder="Повтор пароля"
                        value={repeatPassword}
                        handleChange={handleChangeRepeatPassword}
                    />
                    {isErrorRepeatPassword && (
                        <div className={style.errorMessage}>
                            Пароли не совпадают
                        </div>
                    )}
                    <div className={style.consentCheckbox}>
                        <input className={style.checkBox} type="checkbox" id="agreement" name="agreement" required />
                        <label className={style.labelAgreement} htmlFor="agreement">
                            Регистрируясь, вы соглашаетесь с{" "}
                            <Link to="/terms" className={style.inlineLink}>
                                Условиями использования
                            </Link>
                            {" "}и{" "}
                            <Link to="/privacy" className={style.inlineLink}>
                                Политикой конфиденциальности
                            </Link>
                        </label>
                    </div>
                    <button className={style.registerButton} onClick={handleSubmit}>Зарегистрироваться</button>
                </div>
                <p className={style.text} onClick={() => handleNavigation('/home')}>Вернуться на главную</p>
            </div>
        </div>
    )
}