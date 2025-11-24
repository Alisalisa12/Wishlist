import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Login.module.scss';
import { Input } from '../../components/Input/Input';


export default function Login() {
    const [ name, setName ] = useState('');
    const handleChangeName = (value: string) => {
        setName(value);
    };

    const [ password, setPassword] = useState('');
    const handleChangePassword = (value: string) => {
        setPassword(value);
    };

    const navigate = useNavigate();
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
                        name="username"
                        placeholder="Имя"
                        value={name}
                        handleChange={handleChangeName}
                    />
                    <Input 
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={password}
                        handleChange={handleChangePassword}
                    />
                    {/* <Link to="/" className={style.forgotPassword}>Забыли пароль?</Link> */}
                    <button className={style.buttonLogin}>Войти</button>
                </div>
                <p className={style.text} onClick={() => handleNavigation('/registration')}>Зарегистрироваться</p>
                <p className={style.text} onClick={() => handleNavigation('/home')}>Вернуться на главную</p>
            </div>
        </div>
    )
}