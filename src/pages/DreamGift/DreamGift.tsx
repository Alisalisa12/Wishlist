import style from "./DreamGift.module.scss"


export default function DreamGift() {

    const text = "«DreamGift» - сервис, где ты\nможешь создать вишлисты\nдля любых событий — день\nрождения, свадьба, юбилей";

    return(
        <div className={style.DreamGift}>
            <div className={style.container}>
                <div className={style.main}>
                    <div className={style.textBlock}>
                        <p className={style.text}>{text}</p>
                    </div>
                    <div className={style.createBlock}>
                        <button className={style.createButton}>Создать</button>
                    </div>
                </div>
                <div className={style.giftBlock}>
                    <img src="/images/gift.png" className={style.giftLogo} alt="gift" />
                </div>
            </div>
        </div>
    )
}