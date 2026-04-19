import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./register.scss"

const RegistrationForm = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [phone, setPhone] = useState("");

    const formatPhone = (value) => {
        if (!value) return "";

        const cleaned = value.replace(/\D/g, '');

        const limited = cleaned.substring(0, 11);

        if (limited.length === 0) return "";
        if (limited.length <= 1) return `8`;
        if (limited.length <= 4) return `8 (${limited.substring(1, 4)}`;
        if (limited.length <= 7) return `8 (${limited.substring(1, 4)}) ${limited.substring(4, 7)}`;
        if (limited.length <= 9) return `8 (${limited.substring(1, 4)}) ${limited.substring(4, 7)}-${limited.substring(7, 9)}`;
        return `8 (${limited.substring(1, 4)}) ${limited.substring(4, 7)}-${limited.substring(7, 9)}-${limited.substring(9, 11)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setPhone(formatted);
        setValue("phone_number", formatted.replace(/\D/g, ''));
    };

    const onSubmit = async (data) => {
        if (!data.agree_to_terms) {
            return;
        }

        delete data.agree_to_terms;

        console.log("Отправляемые данные:", JSON.stringify(data, null, 2));
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/register/',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.tokens) {
                localStorage.setItem('access_token', response.data.tokens.access);
                localStorage.setItem('refresh_token', response.data.tokens.refresh);

                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`;

                console.log('Токены сохранены, пользователь ID:', response.data.user_id);
            }

            reset();
            setPhone("");
            navigate('/');
        } catch (error) {
            console.error('Ошибка:', error.response ? error.response.data : error.message);
            alert("Возникла ошибка при регистрации.");
        }
    };

    return (
        <div className="registration-container">
            <h2 className="registration-title">Регистрация</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Логин*</label>
                    <input
                        {...register("username", {
                            required: true,
                            minLength: 3
                        })}
                        placeholder="Введите логин"
                        className="form-input"
                    />
                    {errors.username && <span className="error-message">
                        {errors.username.type === "required" ? "Обязательно заполнить" : "Минимальная длина 3 символа"}
                    </span>}
                </div>

                <div className="form-group">
                    <label htmlFor="nickname" className="form-label">Никнейм*</label>
                    <input
                        {...register("nickname", {
                            required: true,
                            maxLength: 50
                        })}
                        placeholder="Введите никнейм"
                        className="form-input"
                    />
                    {errors.nickname && <span className="error-message">
                        {errors.nickname.type === "required" ? "Обязательно заполнить" : "Максимальная длина 50 символов"}
                    </span>}
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label htmlFor="firstName" className="form-label">Имя*</label>
                        <input
                            {...register("first_name", {
                                required: true,
                                pattern: /^[а-яё]+$/i
                            })}
                            placeholder="Иван"
                            className="form-input"
                        />
                        {errors.first_name && <span className="error-message">
                            {errors.first_name.type === "pattern" ? "Только русские буквы" : "Обязательно заполнить"}
                        </span>}
                    </div>

                    <div className="form-group half">
                        <label htmlFor="lastName" className="form-label">Фамилия*</label>
                        <input
                            {...register("last_name", {
                                required: true,
                                pattern: /^[а-яё]+$/i
                            })}
                            placeholder="Иванов"
                            className="form-input"
                        />
                        {errors.last_name && <span className="error-message">
                            {errors.last_name.type === "pattern" ? "Только русские буквы" : "Обязательно заполнить"}
                        </span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="patronymic" className="form-label">Отчество</label>
                    <input
                        {...register("patronymic", {
                            pattern: /^[а-яё]*$/i
                        })}
                        placeholder="Иванович (необязательно)"
                        className="form-input"
                    />
                    {errors.patronymic && <span className="error-message">
                        Только русские буквы
                    </span>}
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label htmlFor="gender" className="form-label">Пол</label>
                        <select {...register("gender")} className="form-select">
                            <option value="">Выберите пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>

                    <div className="form-group half">
                        <label htmlFor="phoneNumber" className="form-label">Телефон*</label>
                        <input
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="8 (900) 000-00-00"
                            className="form-input"
                        />
                        <input
                            type="hidden"
                            {...register("phone_number", {
                                required: true,
                                pattern: /^8\d{10}$/
                            })}
                        />
                        {errors.phone_number && <span className="error-message">
                            {errors.phone_number.type === "pattern" ? "Формат: 8XXXXXXXXXX" : "Обязательно заполнить"}
                        </span>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">E-mail*</label>
                    <input
                        {...register("email", {
                            required: true,
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        })}
                        placeholder="example@mail.ru"
                        className="form-input"
                    />
                    {errors.email && <span className="error-message">
                        {errors.email.type === "pattern" ? "Некорректный email" : "Обязательно заполнить"}
                    </span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Пароль*</label>
                    <input
                        {...register("password", {
                            required: true,
                            minLength: 6
                        })}
                        type="password"
                        placeholder="Минимум 6 символов"
                        className="form-input"
                    />
                    {errors.password && <span className="error-message">
                        {errors.password.type === "minLength" ? "Минимум 6 символов" : "Обязательно заполнить"}
                    </span>}
                </div>

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            {...register("agree_to_terms", {
                                required: true
                            })}
                            type="checkbox"
                            className="checkbox-input"
                        />
                        <span className="checkbox-text">
                            Я согласен с обработкой моих персональных данных.
                        </span>
                    </label>
                    {errors.agree_to_terms && <span className="error-message">
                        Необходимо подтвердить согласие
                    </span>}
                </div>

                <button type="submit" className="submit-button">
                    Зарегистрироваться
                </button>
            </form>

            <div className="login-link">
                <Link to='/login'>Уже регистрировались?</Link>
            </div>
        </div>
    );
};

export default RegistrationForm;