import React from "react";
import { Link } from "react-router-dom";
import './header.scss';

const Header = () => {
    return (
        <header className="souvenir-header">
            <section className="logo souvenir-header__logo">
                <Link to='main/' className="header-link souvenir-header__link souvenir-header__link--logo">
                    Венец-Сувенир
                </Link>
            </section>
            <section className="links souvenir-header__nav">
                <Link to='catalog/' className="header-link souvenir-header__link">Каталог</Link>
                <Link to='about/' className="header-link souvenir-header__link">О нас</Link>
                <Link to='cart/' className="header-link souvenir-header__link">Корзина</Link>
                <Link to='profile/' className="header-link souvenir-header__link">Профиль</Link>
            </section>
        </header>
    );
}
export default Header;