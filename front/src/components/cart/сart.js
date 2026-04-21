import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './cart.scss'

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [updatingItems, setUpdatingItems] = useState({});
    const navigate = useNavigate();

    const fetchCart = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
        return;
    }
    
    try {
        const response = await axios.get('http://127.0.0.1:8000/cart/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const cartData = Array.isArray(response.data) ? response.data[0] : response.data;
        setCart(cartData);
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        console.error('Данные ошибки:', error.response?.data); // ПРОВЕРКА
    }
   };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        const token = localStorage.getItem('access_token');
        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
        try {
            await axios.patch(`http://127.0.0.1:8000/cart-items/${itemId}/`, 
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart();
        } catch (error) {
            console.error('Ошибка обновления:', error);
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const removeItem = async (itemId) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://127.0.0.1:8000/cart-items/${itemId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem('access_token');
        if (!window.confirm('Очистить корзину?')) return;
        try {
            await axios.delete('http://127.0.0.1:8000/cart/clear/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart();
        } catch (error) {
            console.error('Ошибка очистки:', error);
        }
    };

    const token = localStorage.getItem('access_token');
    if (!token) {
        return (
            <div className="souvenir-cart">
                <div className="souvenir-cart__container">
                    <h2 className="souvenir-cart__title">Корзина</h2>
                    <div className="souvenir-cart__empty">
                        <p>Необходимо <Link to="/login" className="souvenir-cart__link">авторизоваться</Link> для просмотра корзины</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="souvenir-cart">
                <div className="souvenir-cart__container">
                    <h2 className="souvenir-cart__title">Корзина</h2>
                    <div className="souvenir-cart__empty">
                        <p>Ваша корзина пуста</p>
                        <Link to="/catalog" className="souvenir-cart__catalog-link">Перейти в каталог</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="souvenir-cart">
            <div className="souvenir-cart__container">
                <h2 className="souvenir-cart__title">Корзина</h2>
                
                <div className="souvenir-cart__summary">
                    <div className="souvenir-cart__summary-item">
                        <span className="summary-label">Товаров:</span>
                        <span className="summary-value">{cart.total_items}</span>
                    </div>
                    <div className="souvenir-cart__summary-item souvenir-cart__summary-item--total">
                        <span className="summary-label">Общая сумма:</span>
                        <span className="summary-value">{cart.total_price} ₽</span>
                    </div>
                </div>

                <div className="souvenir-cart__items">
                    {cart.items.map(item => (
                        <div key={item.id} className="souvenir-cart__item">
                            <div className="souvenir-cart__item-image-wrapper">
                                <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    className="souvenir-cart__item-image"
                                />
                            </div>
                            
                            <div className="souvenir-cart__item-info">
                                <Link to={`/catalog/product/${item.product.id}`} className="souvenir-cart__item-name">
                                    {item.product.name}
                                </Link>
                                <div className="souvenir-cart__item-prices">
                                    <span className="price-label">Цена:</span>
                                    <span className="price-value">{item.product.sale_price || item.product.out_price} ₽</span>
                                </div>
                                <div className="souvenir-cart__item-prices">
                                    <span className="price-label">Сумма:</span>
                                    <span className="price-value price-value--total">{item.total_price} ₽</span>
                                </div>
                            </div>

                            <div className="souvenir-cart__item-actions">
                                <div className="souvenir-cart__quantity">
                                    <button 
                                        className="souvenir-cart__quantity-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || updatingItems[item.id]}
                                    >
                                        −
                                    </button>
                                    <span className="souvenir-cart__quantity-value">{item.quantity}</span>
                                    <button 
                                        className="souvenir-cart__quantity-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={updatingItems[item.id]}
                                    >
                                        +
                                    </button>
                                </div>
                                <button 
                                    className="souvenir-cart__remove-btn"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="souvenir-cart__footer">
                    <button className="souvenir-cart__clear-btn" onClick={clearCart}>
                        Очистить корзину
                    </button>
                    <Link to="/catalog" className="souvenir-cart__continue-link">
                        Продолжить покупки
                    </Link>
                    <button onClick={() => navigate('/checkout')} className="souvenir-cart__checkout-btn">
                        Оформить заказ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;