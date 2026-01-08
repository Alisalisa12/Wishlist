import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.scss';
import { Input } from '../../components/Input/Input';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    
    const { setIsAuth } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Заполните все поля');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            
            const data = await loginUser(email, password);
            
            // 1. Сохраняем токен
            localStorage.setItem('token', data.token); 

            // 2. Обновляем глобальное состояние (теперь Header это увидит)
            setIsAuth(true); 

            // 3. Переходим на главную
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = (value: string) => {
        setPassword(value);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    }

    return (
        <div className={style.Login}>
            <div className={style.container}>
                <img src="/images/logo.png" className={style.logo} alt='logo' />
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
                    <button 
                        className={style.buttonLogin} 
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </div>
                <p className={style.text} onClick={() => handleNavigation('/registration')}>Зарегистрироваться</p>
                <p className={style.text} onClick={() => handleNavigation('/home')}>Вернуться на главную</p>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </div>
        </div>
    )
}