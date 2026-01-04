import style from "./DreamGift.module.scss"
import { useNavigate } from 'react-router-dom';


export default function DreamGift() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('currentUserId');

    const text = "«DreamGift» - сервис, где ты\nможешь создать вишлисты\nдля любых событий — день\nрождения, свадьба, юбилей";


    const handleCreateClick = () => {
        if (isAuthenticated) {
            navigate('/create-wishlist');
        } else {
            navigate('/login');
        }
    };

    return(
        <div className={style.DreamGift}>
            <div className={style.container}>
                <div className={style.main}>
                    <div className={style.textBlock}>
                        <p className={style.text}>{text}</p>
                    </div>
                    <div className={style.createBlock}>
                        <button className={style.createButton} onClick={handleCreateClick}>Создать</button>
                    </div>
                </div>
                <div className={style.giftBlock}>
                    <img src="/images/gift.png" className={style.giftLogo} alt="gift" />
                </div>
            </div>
        </div>
    )
}