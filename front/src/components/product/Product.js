// Product.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./product.scss";

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/product/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('error:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('Необходимо авторизоваться');
            return;
        }
        setIsAdding(true);
        setMessage('');
        try {
            await axios.post('http://127.0.0.1:8000/cart-items/', {
                product_id: id,
                quantity: quantity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('✓ Товар добавлен в корзину');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Ошибка добавления:', error);
            setMessage('✗ Ошибка при добавлении');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsAdding(false);
        }
    };

    if (!product) return <p>Загрузка...</p>;

    return (
        <div className="product-page souvenir-product">
            <div className="product-container souvenir-product__container">
                <div className="product-image-section souvenir-product__image-section">
                    <div className="souvenir-product__image-wrapper">
                        <img src={product.image} alt={product.name} className="product-main-image souvenir-product__image" />
                    </div>
                </div>

                <div className="product-info-section souvenir-product__info-section">
                    <h1 className="product-title souvenir-product__title">{product.name}</h1>

                    <div className="product-prices souvenir-product__prices">
                        <div className="price-old souvenir-product__price-old">
                            <span className="old-label">Старая цена:</span>
                            <span className="old-value"><strike>{product.out_price} ₽</strike></span>
                        </div>
                        <div className="price-current souvenir-product__price-current">
                            <span className="current-label">Наша цена:</span>
                            <span className="current-value">{product.sale_price} ₽</span>
                        </div>
                    </div>

                    <div className="product-description souvenir-product__description">
                        <h3>Описание сувенира</h3>
                        <p>{product.description || 'Этот сувенир сделан с душой нашими ульяновскими мастерами. Каждый предмет уникален и хранит тепло рук создателя.'}</p>
                    </div>

                    <div className="souvenir-product__quantity">
                        <label>Количество:</label>
                        <div className="quantity-control">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                    </div>

                    <div className="souvenir-product__actions">
                        <Link to={`/catalog`} className="back-button souvenir-product__back-button">
                            ← В каталог
                        </Link>
                        <button 
                            className="souvenir-product__buy-button"
                            onClick={addToCart}
                            disabled={isAdding}
                        >
                            {isAdding ? 'Добавление...' : 'Добавить в корзину'}
                        </button>
                    </div>
                    {message && <div className="cart-message">{message}</div>}
                </div>
            </div>
        </div>
    );
}

export default Product;