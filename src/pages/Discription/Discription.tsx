import style from "./Discription.module.scss"


export default function Discription() {

    const text1 = "Создай список желаний для любого\nсобытия!Гарантированно получай подарки\nв желаемом формате - выбирай цвет,\nкачество комплектацию. Отправляй\nдрузьям и радуйся!";
    const text2 = "Отправляй ему ссылку и выбирай из его\nсписка желаний! Забронированные тобой\nподарки можешь найти в отдельной вкладке\n- точно не потеряешь";

    return(
        <div className={style.Discription}>
            <div className={style.container}>
                <div className={style.main}>
                    <div className={style.firstBlock}>
                        <p className={style.title}>Хочешь получать только желанные подарки?</p>
                        <p className={style.text}>{text1}</p>
                        <button className={style.wantButton}>Хочу вишлист</button>
                    </div>
                    <div className={style.secondBlock}>
                        <p className={style.title}>Не знаешь, что подарить другу?</p>
                        <p className={style.text}>{text2}</p>
                        <button className={style.sendButton}>Отправить</button>
                    </div>
                </div>
                <div className={style.giftBlock}>
                    <img src="/images/gift.png" className={style.giftLogo} alt="gift" />
                </div>
            </div>
        </div>
    )
}