import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./checkout.scss";

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        delivery_date: '',
        delivery_time: '',
        payment_method: 'cash',
        card_number: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCart();
        // eslint-disable-next-line
    }, []);

    const fetchCart = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.get('http://127.0.0.1:8000/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const cartData = Array.isArray(response.data) ? response.data[0] : response.data;
            setCart(cartData);
            if (!cartData || cartData.items.length === 0) {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCardChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
        setFormData(prev => ({ ...prev, card_number: formatted }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.address.trim()) {
            newErrors.address = 'Введите адрес доставки';
        }
        if (!formData.delivery_date) {
            newErrors.delivery_date = 'Выберите дату доставки';
        }
        if (!formData.delivery_time) {
            newErrors.delivery_time = 'Выберите время доставки';
        }
        if (formData.payment_method === 'card') {
            const cardDigits = formData.card_number.replace(/\s/g, '');
            if (!cardDigits) {
                newErrors.card_number = 'Введите номер карты';
            } else if (cardDigits.length < 16) {
                newErrors.card_number = 'Введите 16 цифр номера карты';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        const token = localStorage.getItem('access_token');
        
        const orderData = {
            address: formData.address,
            delivery_date: formData.delivery_date,
            delivery_time: formData.delivery_time,
            payment_method: formData.payment_method,
            card_number: formData.payment_method === 'card' ? formData.card_number.replace(/\s/g, '') : ''
        };
        
        try {
            await axios.post('http://127.0.0.1:8000/orders/', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Заказ успешно оформлен!');
            navigate('/profile');
        } catch (error) {
            console.error('Ошибка оформления:', error);
            if (error.response?.data) {
                setErrors(error.response.data);
            } else {
                alert('Ошибка при оформлении заказа');
            }
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    if (!cart) return <div>Корзина не найдена</div>;

    return (
        <div className="souvenir-checkout">
            <div className="souvenir-checkout__container">
                <h2 className="souvenir-checkout__title">Оформление заказа</h2>
                
                <div className="souvenir-checkout__summary">
                    <div className="souvenir-checkout__summary-item">
                        <span className="summary-label">Товаров в заказе:</span>
                        <span className="summary-value">{cart.total_items}</span>
                    </div>
                    <div className="souvenir-checkout__summary-item souvenir-checkout__summary-item--total">
                        <span className="summary-label">Общая сумма:</span>
                        <span className="summary-value">{cart.total_price} ₽</span>
                    </div>
                </div>

                <form className="souvenir-checkout__form" onSubmit={handleSubmit}>
                    <div className="souvenir-checkout__field">
                        <label>Адрес доставки *</label>
                        <textarea 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Город, улица, дом, квартира"
                            className={errors.address ? 'error' : ''}
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    <div className="souvenir-checkout__row">
                        <div className="souvenir-checkout__field">
                            <label>Дата доставки *</label>
                            <input 
                                type="date"
                                name="delivery_date"
                                value={formData.delivery_date}
                                onChange={handleChange}
                                min={minDate}
                                className={errors.delivery_date ? 'error' : ''}
                            />
                            {errors.delivery_date && <span className="error-message">{errors.delivery_date}</span>}
                        </div>

                        <div className="souvenir-checkout__field">
                            <label>Время доставки *</label>
                            <select 
                                name="delivery_time"
                                value={formData.delivery_time}
                                onChange={handleChange}
                                className={errors.delivery_time ? 'error' : ''}
                            >
                                <option value="">Выберите время</option>
                                <option value="09:00-12:00">09:00 - 12:00</option>
                                <option value="12:00-15:00">12:00 - 15:00</option>
                                <option value="15:00-18:00">15:00 - 18:00</option>
                                <option value="18:00-21:00">18:00 - 21:00</option>
                            </select>
                            {errors.delivery_time && <span className="error-message">{errors.delivery_time}</span>}
                        </div>
                    </div>

                    <div className="souvenir-checkout__field">
                        <label>Способ оплаты *</label>
                        <div className="souvenir-checkout__radio-group">
                            <label className="souvenir-checkout__radio">
                                <input 
                                    type="radio"
                                    name="payment_method"
                                    value="cash"
                                    checked={formData.payment_method === 'cash'}
                                    onChange={handleChange}
                                />
                                <span>Наличными курьеру</span>
                            </label>
                            <label className="souvenir-checkout__radio">
                                <input 
                                    type="radio"
                                    name="payment_method"
                                    value="card"
                                    checked={formData.payment_method === 'card'}
                                    onChange={handleChange}
                                />
                                <span>Банковской картой</span>
                            </label>
                        </div>
                    </div>

                    {formData.payment_method === 'card' && (
                        <div className="souvenir-checkout__field">
                            <label>Номер карты *</label>
                            <input 
                                type="text"
                                name="card_number"
                                value={formData.card_number}
                                onChange={handleCardChange}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                className={errors.card_number ? 'error' : ''}
                            />
                            {errors.card_number && <span className="error-message">{errors.card_number}</span>}
                        </div>
                    )}

                    <div className="souvenir-checkout__actions">
                        <button 
                            type="button"
                            className="souvenir-checkout__back-btn"
                            onClick={() => navigate('/cart')}
                        >
                            ← Вернуться в корзину
                        </button>
                        <button 
                            type="submit"
                            className="souvenir-checkout__submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? 'Оформление...' : 'Подтвердить заказ'}
                        </button>
                    </div>
                </form>

                <div className="souvenir-checkout__items">
                    <h3 className="souvenir-checkout__items-title">Состав заказа:</h3>
                    <div className="souvenir-checkout__items-list">
                        {cart.items.map(item => (
                            <div key={item.id} className="souvenir-checkout__item">
                                <div className="item-image">
                                    <img src={item.product.image} alt={item.product.name} />
                                </div>
                                <div className="item-info">
                                    <span className="item-name">{item.product.name}</span>
                                    <span className="item-quantity">{item.quantity} шт.</span>
                                </div>
                                <span className="item-price">{item.total_price} ₽</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;