import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './catalog.scss'

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);

    const fetchProducts = async (url = 'http://127.0.0.1:8000/product/') => {
        try {
            const response = await axios.get(url);
            setProducts(response.data.results);
            setNextPage(response.data.next);
            setPrevPage(response.data.previous);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="box-catalog souvenir-catalog">
            {products.map(product => (
                <Link
                    key={product.id}
                    to={`/catalog/product/${product.id}`}
                    className="card-product souvenir-card"
                >
                    <div className="souvenir-card__image-wrapper">
                        <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="product-info souvenir-card__info">
                        <h3 className="product-name souvenir-card__title">{product.name}</h3>
                        <section className="prices souvenir-card__prices">
                            <span className="old-price souvenir-card__old-price">
                                <strike>{product.out_price} ₽</strike>
                            </span>
                            <span className="new-price souvenir-card__new-price">
                                {product.sale_price} ₽
                            </span>
                        </section>
                    </div>
                </Link>
            ))}

            <div className="pagination souvenir-pagination">
                <button
                    className="souvenir-pagination__button"
                    onClick={() => fetchProducts(prevPage)}
                    disabled={!prevPage}
                >
                    ← Назад
                </button>
                <button
                    className="souvenir-pagination__button"
                    onClick={() => fetchProducts(nextPage)}
                    disabled={!nextPage}
                >
                    Вперед →
                </button>
            </div>
        </div>
    );

}

export default Catalog;