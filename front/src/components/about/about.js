import img1 from "./static/img1.jpg"
import img2 from "./static/img2.jpg"
import img3 from "./static/img3.jpg"
import React from "react";
import "./about.scss";

const About = () => {
    return (
        <div className="about-container souvenir-about">
            <h1 className="about-title souvenir-about__title">О нас</h1>

            <div className="about-intro souvenir-about__intro">
                <h2>Сувениры с душой — частичка Ульяновска в вашем доме!</h2>
                <p>Мы создаем и собираем сувениры, которые хранят тепло нашего города. Каждый предмет — это история, сделанная с любовью к ремеслу и традициям.</p>
            </div>

            <div className="cards-container souvenir-about__cards">
                <div className="about-card souvenir-about__card">
                    <div className="card-image souvenir-about__card-image">
                        <img src={img1} alt="Мастера" />
                    </div>
                    <div className="card-content souvenir-about__card-content">
                        <h3>Мастера</h3>
                        <p>Умельцы с золотыми руками
                            <br />
                            Наши мастера — хранители традиций. Кто-то лепит свистульки, кто-то варит мыло, а кто-то создает деревянные игрушки. Всё с душой и теплом.</p>
                    </div>
                </div>

                <div className="about-card souvenir-about__card">
                    <div className="card-image souvenir-about__card-image">
                        <img src={img2} alt="Ремесла" />
                    </div>
                    <div className="card-content souvenir-about__card-content">
                        <h3>Ремесла</h3>
                        <p>Только натуральное
                            <br />
                            Дерево, глина, лен, шерсть, воск — работаем только с природными материалами, чтобы каждая вещь несла добро и экологичность.</p>
                    </div>
                </div>

                <div className="about-card souvenir-about__card">
                    <div className="card-image souvenir-about__card-image">
                        <img src={img3} alt="Традиции" />
                    </div>
                    <div className="card-content souvenir-about__card-content">
                        <h3>Традиции</h3>
                        <p>С 2010 года в Ульяновске
                            <br />
                            Уже 15 лет собираем и создаем сувениры, которые увозят в разные уголки страны и мира. Каждый гость уносит с собой частичку Симбирска.</p>
                    </div>
                </div>
            </div>

            <div className="contacts-section souvenir-about__contacts">
                <h2>Где нас найти</h2>

                <div className="contacts-grid souvenir-about__contacts-grid">
                    <div className="contact-item souvenir-about__contact-item">
                        <div className="contact-info">
                            <h4>Позвоните нам</h4>
                            <p>8 (8422) 12-34-56</p>
                            <p>8 (927) 987-65-43</p>
                        </div>
                    </div>

                    <div className="contact-item souvenir-about__contact-item">
                        <div className="contact-info">
                            <h4>Заезжайте в гости</h4>
                            <p>г. Ульяновск, ул. Гончарова, 25</p>
                            <p>Сувенирная лавка "Венец-Сувенир"</p>
                        </div>
                    </div>

                    <div className="contact-item souvenir-about__contact-item">
                        <div className="contact-info">
                            <h4>Пишите нам</h4>
                            <p>souvenir73@mail.ru</p>
                            <p>simsuvenir@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default About;