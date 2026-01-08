import { Header } from "../../components/Header/Header";
import DreamGift from "../DreamGift/DreamGift";
import Discription from "../Discription/Discription";
import HowWorks from "../HowWorks/HowWorks";
import { Footer } from "../../components/Footer/Footer";
import style from "./Home.module.scss";

export default function Home() {
    return (
        <div className={style.Home}>
            <Header /> 
            <DreamGift />
            <Discription />
            <HowWorks />
            <Footer />
        </div>
    )
}