import React from "react";
import { Link } from "react-router-dom";
import "./main.scss"

const Main = () => {
    return (
        <div className="main-container souvenir-hero">
            <div className="main-background souvenir-hero__background">
                <div className="main-overlay souvenir-hero__overlay">
                    <div className="main-content souvenir-hero__content">
                        <h1 className="main-title souvenir-hero__title">
                            Сувениры с душой<br />
                            <span>из самого сердца Ульяновска</span>
                        </h1>
                        <p className="main-subtitle souvenir-hero__subtitle">
                            Магниты, керамика, деревянные игрушки, мыло ручной работы<br />
                            и другие тёплые подарки для себя и близких
                        </p>
                        <Link to="/catalog" className="main-button souvenir-hero__button">
                            Выбрать подарок
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;