import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.scss';
import { Input } from '../../components/Input/Input';
import { loginUser } from '../../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [ name, setName ] = useState('');

    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.token); // сохраняем токен
            navigate('/home'); // переходим на главную
        } catch (err: any) {
            setError(err.message || 'Неверный логин или пароль');
        }
    };
    // const handleChangeName = (value: string) => {
    //     setName(value);
    // };

    const handleChangePassword = (value: string) => {
        setPassword(value);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <div className={style.Login}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt='logo'/>
                <div className={style.form}>
                    <p className={style.title}>Войдите, чтобы начать</p>
                    <Input 
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={email}
                        handleChange={setEmail}
                    />
                    <Input 
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        handleChange={handleChangePassword}
                    />
                    {/* <Link to="/" className={style.forgotPassword}>Забыли пароль?</Link> */}
                    <button className={style.buttonLogin} onClick={handleLogin}>Войти</button>
                </div>
                <p className={style.text} onClick={() => handleNavigation('/registration')}>Зарегистрироваться</p>
                <p className={style.text} onClick={() => handleNavigation('/home')}>Вернуться на главную</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}