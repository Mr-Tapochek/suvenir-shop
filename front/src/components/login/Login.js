import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss"

const LoginForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        console.log("Отправляемые данные:", JSON.stringify(data, null, 2));

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/login/',
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

                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.tokens.access}`
            };

            reset();
            navigate('/profile');
        } catch (error) {
            console.error('Ошибка:', error.response ? error.response.data : error.message);
            alert("Возникла ошибка при авторизации.");
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Вход в аккаунт</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <div className="form-group">
                    <input {...register("login", { required: true })} placeholder="Логин или email" className="form-input" />
                    {errors.login && <span className="error-message">Обязательно</span>}
                </div>

                <div className="form-group">
                    <input {...register("password", { required: true })} type="password" placeholder="Пароль" className="form-input" />
                    {errors.password && <span className="error-message">Обязательно</span>}
                </div>

                <button type="submit" className="submit-button">
                    Войти
                </button>
            </form>

            <div className="register-link">
                <Link to='/register'>Ещё не регистрировались? </Link>
            </div>
        </div>
    )
}

export default LoginForm;