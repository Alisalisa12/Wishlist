import style from "./HowWorks.module.scss";


export default function HowWorks() {
    return(
        <div className={style.HowWorks}>
            <div className={style.container}>
                <p className={style.mainTitle}>Как это работает?</p>
                <div className={style.imagesBlock}>
                    <div className={style.step}>
                        <img src="/images/step1.png" className={style.stepImage1} alt="step1" />
                        <div className={style.stepText}>
                        <div className={style.stepTitle}>ШАГ 1</div>
                        <div className={style.title}>Создай вишлист</div>
                        <div className={style.text}>Добавляй свои желания с картинками или ссылками</div>
                        </div>
                    </div>

                    <div className={style.arrowWrapper}>
                        <img src="/images/union.png" className={style.union} alt="arrow" />
                    </div>

                    <div className={style.step}>
                        <img src="/images/step2.png" className={style.stepImage2} alt="step2" />
                        <div className={style.stepText}>
                        <div className={style.stepTitle}>ШАГ 2</div>
                        <div className={style.title}>Отправь друзьям</div>
                        <div className={style.text}>Они смогут забронировать свободные подарки</div>
                        </div>
                    </div>

                    <div className={style.arrowWrapper}>
                        <img src="/images/union.png" className={style.union} alt="arrow" />
                    </div>

                    <div className={style.step}>
                        <img src="/images/step3.png" className={style.stepImage3} alt="step3" />
                        <div className={style.stepText}>
                        <div className={style.stepTitle}>ШАГ 3</div>
                        <div className={style.title}>Готово! Жди и радуйся!</div>
                        <div className={style.text}>Ты не увидишь, что из списка забронировано — сохраним нотку интриги</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}