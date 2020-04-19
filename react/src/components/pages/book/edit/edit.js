import React, { useEffect, useState } from "react";

import "./edit.css";

import { Breadcrumbs } from "@components/global";
import { Form } from "../_form";
import { config } from "@config";
import ApiService from "@services/apiService";
import { Alert } from "@alert";
import { Progress } from '@progress/linear';

function Edit(props) {
    const
        breadcrumbs = [
            { link: '/books', name: 'Книги' },
            { link: '/books/edit', name: 'Редактировать книгу' }
        ],
        [ book, setBook ] = useState(),
        [ message, setMessage ] = useState(null),
        [ error, setError] = useState(null),
        [ serverError, setServerError ] = useState(false),
        [ loading, setLoading ] = useState(true);

    useEffect(() => {
        setLoading(true);

        let { id } = props.match.params;

        (new ApiService).getBook(parseInt(id))
            .then(res => {
                Object.assign(res, {password: ''});
                res.receipt_at = convertDate(res.receipt_at);
                console.log(res);
                setBook(res);
                setLoading(false);
            })
    }, []);

    function convertDate(timestamp) {
        return new Date(timestamp*1000).toISOString().substr(0, 16);
    }

    function handleSubmit(data) {

        let { id } = props.match.params;

        data.receipt_at = parseInt(new Date(data.receipt_at).getTime()/1000);
        Object.assign(data, {updated_at: Date.now()/1000|0});

        (new ApiService).updateBook(id, data)
            .then(res => {
                setError(null);
                setBook(res);
                setMessage('Данные успешно изменены');
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
        <div className="layout__wrapper">
            <div className="layout__wrapper-title">
                <span className="title">Редактировать книгу</span>
            </div>
            { loading ? <Progress /> : <Form handleSubmit={ handleSubmit } book={ book } eFields={ error } /> }
        </div>
        </>
    )
}

export { Edit }