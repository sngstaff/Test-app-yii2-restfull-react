import React, { Fragment, useState } from 'react';

import ApiService from '@services/apiService';
import { Progress } from '@progress/linear';
import { Alert } from '@alert';

function Login(props) {
    const
        [ username, setUsername ] = useState(''),
        [ password, setPassword ] = useState(''),
        [ hidden, setHidden ] = useState({
            bool: true,
            icon: 'fa-eye-slash'
        }),
        [ error, setError ] = useState(false),
        [ loading, setLoading ] = useState(false),
        [ message, setMessage ] = useState('');

    function submitForm(form) {
        form.preventDefault();

        setLoading(true);
        setError(false);

        (new ApiService).login({ username, password })
            .then((res) => {
                setLoading(false);
                ApiService.setUser(res)
                    .then(() => {
                        props.updateUser();
                        props.history.push('/');
                    })
                    .catch(() => {
                        setError(true);
                        setMessage('Неверные данные пользователя')
                    });
            })
            .catch((err) => {
                if (!err.json) {
                    setLoading(false);
                    setError(true);
                    setMessage('Ошибка сервера');
                } else {
                    err.json().then((res) => {
                        setLoading(false);
                        setError(true);
                        setMessage(res[0].message);
                    })
                }
            })
    }

    function toggleShow() {
        setHidden({
            bool: !hidden.bool,
            icon: hidden.bool ? "fa-eye" : "fa-eye-slash"
        })
    }

    return (
        <Fragment>
            { loading ? <Progress /> : '' }
            <div className="site__inner">
                <div className="site__header">
                    <span className="title text-center">Авторизация</span>
                    <span className="text text-center">Система учета книг</span>
                </div>
                <div className="site__body">
                    <form className="site__form" onSubmit={ submitForm }>
                        <div className="site__form-item">
                            <span className="label">Логин</span>
                            <input
                                type="text"
                                onChange={ event => setUsername(event.target.value) }
                                autoComplete="off"
                                maxLength="128"
                                required
                            />
                            <div className="icon">
                                <i className="fa fa-user"> </i>
                            </div>
                        </div>
                        <div className="site__form-item">
                            <span className="label">Пароль</span>
                            <input
                                type={ hidden.bool ? "password" : "text" }
                                onChange={ event => setPassword(event.target.value) }
                                autoComplete="off"
                                maxLength="128"
                                required
                            />
                            <div className="icon">
                                <i className={"fa cur-p " + hidden.icon} onClick={ toggleShow }> </i>
                            </div>
                        </div>
                        <button className="btn btn-blue" type="submit">Войти</button>
                        { error ? <Alert color="error">{message}</Alert> : ''}
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export { Login }