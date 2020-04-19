import React, { useState } from "react";

import "./create.css";

import { Breadcrumbs } from "@components/global";
import { Form } from "../_form";
import { config } from "@config";
import ApiService from "@services/apiService";
import { Alert } from "@alert";
import { Progress } from '@progress/linear';

const initialState = {
    username: '',
    password: 'required',
    name: '',
    surname: '',
    email: '',
    roles: config.ROLE_CLIENT,
    passport_series: '',
};

function Create() {
    const
        breadcrumbs = [
            { link: '/clients', name: 'Клиенты' },
            { name: 'Добавить клиента' }
        ],
        [ message, setMessage ] = useState(null),
        [ error, setError] = useState(null),
        [ serverError, setServerError ] = useState(false),
        [ loading, setLoading ] = useState(false);

    function handleSubmit(data) {
        setLoading(true);

        (new ApiService).createUser(data)
            .then(res => {
                setLoading(false);
                setError(null);
                if (res.status === 201)
                    setMessage(res.message);
            })
            .catch(err => {
                setLoading(false);
                if (err.status === 422) {
                    err.json().then(fields => {
                        setError(fields);
                    });
                } else if (!err.ok) {
                    setServerError(true);
                }
            })
    }

    return (
        <>
        <Breadcrumbs routes={ breadcrumbs } />
        { message ? <Alert color="success">{ message }</Alert> : null }
        { serverError ? <Alert color="error">Возникла ошибка на стороне сервера</Alert> : null }
        { loading ? <Progress /> : '' }
        <div className="layout__wrapper">
            <div className="layout__wrapper-title">
                <span className="title">Информация клиента</span>
            </div>
            <Form handleSubmit={ handleSubmit } user={ initialState } eFields={ error } />
        </div>
        </>
    )
}

export { Create }