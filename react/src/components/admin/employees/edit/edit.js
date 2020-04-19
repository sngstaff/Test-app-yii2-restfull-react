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
            { link: '/employees', name: 'Сотрудники' },
            { link: '/employees/edit', name: 'Редактировать сотрудника' }
        ],
        [ user, setUser ] = useState(),
        [ message, setMessage ] = useState(null),
        [ error, setError] = useState(null),
        [ serverError, setServerError ] = useState(false),
        [ loading, setLoading ] = useState(true);

    useEffect(() => {
        setLoading(true);

        let { id } = props.match.params;

        (new ApiService).getUser(parseInt(id))
            .then(res => {
                Object.assign(res, {password: ''});
                setUser(res);
                setLoading(false);
            })
    }, []);

    function handleSubmit(data) {

        let { id } = props.match.params;

        (new ApiService).updateUser(id, data)
            .then(res => {
                setError(null);
                setUser(res);
                setMessage('Данные успешно изменены');
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
        <div className="layout__wrapper">
            <div className="layout__wrapper-title">
                <span className="title">Редактировать сотрудника</span>
            </div>
            { loading ? <Progress /> : <Form handleSubmit={ handleSubmit } user={ user } eFields={ error } /> }
        </div>
        </>
    )
}

export { Edit }