import React, { useState } from "react";

import "./create.css";

import { Breadcrumbs } from "@components/global";
import { Form } from "../_form";
import { config } from "@config";
import ApiService from "@services/apiService";
import { Alert } from "@alert";
import { Progress } from '@progress/linear';

const initialState = {
    title: '',
    author: '',
    code: '',
    receipt_at: '',
    total: '',
};

function Create() {
    const
        breadcrumbs = [
            { link: '/books', name: 'Книги' },
            { link: '/books/create', name: 'Добавить книгу' }
        ],
        [ message, setMessage ] = useState(null),
        [ serverError, setServerError ] = useState(false),
        [ loading, setLoading ] = useState(false);

    function handleSubmit(data) {
        setLoading(true);

        data.receipt_at = parseInt(new Date(data.receipt_at).getTime()/1000);

        (new ApiService).createBook(data)
            .then(res => {
                setLoading(false);
                if (res.status === 201)
                    setMessage(res.message);
            })
            .catch(err => {
                setLoading(false);
                if (!err.ok) {
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
                <span className="title">Информация о книге</span>
            </div>
            <Form handleSubmit={ handleSubmit } book={ initialState } />
        </div>
        </>
    )
}

export { Create }