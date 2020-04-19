import React, { useState } from "react";

import "./forms.css";

import { Alert } from "@alert";

function Form({ book, handleSubmit } = props) {
    const
        [ data, setData ] = useState(book);

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
                    <span className="label">Наименование</span>
                    <input type="text" name="title" placeholder="Программирование PHP" onChange={ handleChange } required defaultValue={ data.title } />
                </div>
                <div className="site__form-item">
                    <span className="label">Автор:</span>
                    <input type="text" name="author" placeholder="Максим" onChange={ handleChange } required defaultValue={ data.author } />
                </div>
                <div className="site__form-item">
                    <span className="label">Артикул</span>
                    <input type="text" name="code" placeholder="PP01" onChange={ handleChange } required defaultValue={ data.code } />
                </div>
            </div>
            <div className="form__container-item">
                <div className="site__form-item">
                    <span className="label">Дата поступления:</span>
                    <input type="datetime-local" name="receipt_at" placeholder="12/01/2020" onChange={ handleChange } required defaultValue={ data.receipt_at } />
                </div>
                <div className="site__form-item">
                    <span className="label">Количество:</span>
                    <input type="number" name="total" placeholder="10" onChange={ handleChange } defaultValue={ data.total } />
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