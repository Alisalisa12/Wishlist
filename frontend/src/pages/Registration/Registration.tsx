import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Registration.module.scss';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../api'; // используем API-модуль

const NAME_REGEX = /^[a-zA-ZА-яёЁ\s\-']{1,64}$/;
const EMAIL_REGEX = /^[^\s@]{1,64}@[^\s@]{1,64}\.[^\s@]{2,10}$/;
const LOGIN_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,64}$/;

export default function Registration() {
    const { setIsAuth } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [isErrorName, setErrorName] = useState(false);
    const [isErrorEmail, setErrorEmail] = useState(false);
    const [isErrorLogin, setErrorLogin] = useState(false);
    const [isErrorPassword, setErrorPassword] = useState(false);
    const [isErrorRepeatPassword, setErrorRepeatPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const handleSubmit = async () => {
        // Сброс ошибок
        setErrorName(false);
        setErrorEmail(false);
        setErrorLogin(false);
        setErrorPassword(false);
        setErrorRepeatPassword(false);
        setServerError('');

        let hasError = false;

        if (!NAME_REGEX.test(name.trim())) { setErrorName(true); hasError = true; }
        if (!EMAIL_REGEX.test(email)) { setErrorEmail(true); hasError = true; }
        if (!LOGIN_REGEX.test(login)) { setErrorLogin(true); hasError = true; }
        if (!PASSWORD_REGEX.test(password)) { setErrorPassword(true); hasError = true; }
        if (password !== repeatPassword) { setErrorRepeatPassword(true); hasError = true; }

        if (hasError) return;

        try {
            const data = await registerUser(email, name, login, password, repeatPassword);

            // Сохраняем токен
            localStorage.setItem('token', data.token);
            setIsAuth(true);
            navigate('/home');
        } catch (err: any) {
            setServerError(err.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className={style.Registration}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt="logo" />
                <div className={style.form}>
                    <p className={style.title}>Регистрация</p>

                    <Input type="text" name="username" placeholder="Имя" value={name} handleChange={setName} />
                    {isErrorName && <div className={style.errorMessage}>Имя: 1–64 символа</div>}

                    <Input type="email" name="email" placeholder="Почта" value={email} handleChange={setEmail} />
                    {isErrorEmail && <div className={style.errorMessage}>Некорректный email</div>}

                    <Input type="text" name="login" placeholder="Логин (Username)" value={login} handleChange={setLogin} />
                    {isErrorLogin && <div className={style.errorMessage}>Логин: 3–20 символов</div>}

                    <Input type="password" name="password" placeholder="Пароль" value={password} handleChange={setPassword} />
                    {isErrorPassword && <div className={style.errorMessage}>Пароль слишком простой</div>}

                    <Input type="password" name="passwordConfirm" placeholder="Повтор пароля" value={repeatPassword} handleChange={setRepeatPassword} />
                    {isErrorRepeatPassword && <div className={style.errorMessage}>Пароли не совпадают</div>}

                    <div className={style.consentCheckbox}>
                        <input type="checkbox" id="agreement" required />
                        <label htmlFor="agreement">Согласен с условиями</label>
                    </div>

                    <button className={style.registerButton} onClick={handleSubmit}>Создать аккаунт</button>

                    {serverError && <p style={{ color: 'red', marginTop: '10px' }}>{serverError}</p>}
                </div>
            </div>
        </div>
    );
}
