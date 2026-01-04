import style from "./Discription.module.scss"
import { useNavigate } from "react-router-dom";


export default function Discription() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('currentUserId');

    const text1 = "Создай список желаний для любого события!Гарантированно получай подарки в желаемом формате - выбирай цвет, качество комплектацию. Отправляй друзьям и радуйся!";
    const text2 = "Отправляй ему ссылку и выбирай из его списка желаний! Забронированные тобой подарки можешь найти в отдельной вкладке - точно не потеряешь";

    const handleWantWishlist = () => {
        if (isAuthenticated) {
        navigate('/create-wishlist');
        } else {
        navigate('/login');
        }
    };

    const handleSendGift = () => {
        if (isAuthenticated) {
        navigate('/friends');
        } else {
        navigate('/login');
        }
    };

    return(
        <div className={style.Discription}>
            <div className={style.container}>
                <div className={style.main}>
                    <div className={style.firstBlock}>
                        <p className={style.title}>Хочешь получать только желанные подарки?</p>
                        <p className={style.text}>{text1}</p>
                        <button className={style.wantButton} onClick={handleWantWishlist}>Хочу вишлист</button>
                    </div>
                    <div className={style.secondBlock}>
                        <p className={style.title}>Не знаешь, что подарить другу?</p>
                        <p className={style.text}>{text2}</p>
                        <button className={style.sendButton} onClick={handleSendGift}>Отправить</button>
                    </div>
                </div>
                <div className={style.giftBlock}>
                    <img src="/images/gift.png" className={style.giftLogo} alt="gift" />
                </div>
            </div>
        </div>
    )
}