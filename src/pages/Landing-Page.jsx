import { useNavigate } from "react-router-dom";
import { Button } from "../components/shared/button/Button";
import { Accordion } from "../components/shared/accordion/Accordion";
import style from './Landing-Page.module.css';
import heroImage from '../assets/images/hero_image.png'

function LandingPage(){

    const FAQ_ITEMS = [
        {
            question: 'What is Emenu?',
            answer: 'Emenu is a SaaS platform built for small and medium businesses. Organize your products, manage services, and track every transaction, all from a single, simple system.',
        },
        {
            question: 'How it works?',
            answer: 'Sign up. Create your store. Share your QR code. Let customers explore your products and services instantly, while you stay in control from a single dashboard.',
        },
    ];

    const navigate = useNavigate();

    return(
        
        <div className={style.page}>
            {/* tagline */}
            <div className={style.hero}>
                <img src={heroImage} alt="hero-image"  className={style["hero-background-image"]}/>
                <div className={style["hero-content"]}>
                    <h1 className={style["hero-title"]}>
                        Run your shop. Effortlessly.
                    </h1>

                    <p className={style["hero-subtitle"]}>
                        Everything you need to manage your business in one place.
                    </p>

                    <div className={style["hero-button"]}>
                        <Button variant="primary" onClick={() => navigate("/register-user")}>
                            Get Started
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/login")}>
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* FAQ */}
            <div className={style.content}>
                <div>
                    <h2 className={style["faq-title"]}>You asking, We delivere</h2>
                    <Accordion items={FAQ_ITEMS} />
                </div>
            </div>

        </div>
    )

}

export default LandingPage