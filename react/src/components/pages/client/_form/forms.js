import React, { useState, useEffect } from "react";

import "./forms.css";

import { Alert } from "@alert";

function Form({ user, handleSubmit, eFields } = props) {
    const
        [ error, setError ] = useState(false),
        [ data, setData ] = useState(user),
        [ pwdConfirm, setPwdConfirm] = useState('');

    useEffect(({password} = data) => {
        if (pwdConfirm.length !== 0) {
            setError(pwdConfirm !== password);
        } else if (password.length === 0 && pwdConfirm.length === 0) {
            setError(false);
        }
    }, [data.password, pwdConfirm]);

    useEffect(() => {
        if (eFields !== null) {
            eFields.map((item) => {
                let label = document.querySelector(`input[name="${item.field}"]`).nextSibling;
                label.innerHTML = item.message;
            })
        }
    }, [eFields]);

    function handleChange(event) {
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
    }

    return (
        <form className="default__form form__container" onSubmit={ event => { event.preventDefault(); handleSubmit(data) } }>
            <div className="form__container-item">
                <div className="site__form-item">
                    <span className="label">Вход в систему (логин):</span>
                    <input type="text" name="username" placeholder="demo" onChange={ handleChange } required defaultValue={ data.username } />
                    <span className="error" />
                </div>
                <div className="site__form-item">
                    <span className="label">Пароль:</span>
                    <input type="password" name="password" placeholder="demo" minLength={ 6 } onChange={ handleChange } required={ user.password === 'required' } />
                </div>
                <div className="site__form-item">
                    <span className="label">Повторите пароль:</span>
                    <input type="password" name="pwdConfirm" placeholder="demo" minLength={ 6 } onChange={ (e) => { setPwdConfirm(e.target.value) } } required={ user.password === 'required' } />
                    { error ? <span className="error">Пароли не совпадают</span> : null }
                </div>
                <div className="site__form-item">
                    <span className="label">Email:</span>
                    <input type="text" name="email" placeholder="demo@example.com" onChange={ handleChange } required defaultValue={ data.email } />
                    <span className="error" />
                </div>
            </div>
            <div className="form__container-item">
                <div className="site__form-item">
                    <span className="label">Имя:</span>
                    <input type="text" name="name" placeholder="Иван" onChange={ handleChange } required defaultValue={ data.name } />
                </div>
                <div className="site__form-item">
                    <span className="label">Фамилия:</span>
                    <input type="text" name="surname" placeholder="Иванович Иванов" onChange={ handleChange } defaultValue={ data.surname } />
                </div>
                <div className="site__form-item">
                    <span className="label">Серия и номер пасспорта:</span>
                    <input type="text" name="passport_series" placeholder="10 10 202020" minLength={ 10 } maxLength={ 10 } required onChange={ handleChange } defaultValue={ data.passport_series } />
                </div>
            </div>
            <div className="form__container-footer">
                <div className="site__form-item">
                    <button className="btn btn-blue">Добавить</button>
                </div>
            </div>
        </form>
    )
}

export { Form }