import React, { useState, useEffect } from 'react';
import cookie from "react-cookies";

import './book.css';

import { Breadcrumbs } from "@components/global";
import { Progress } from '@progress/linear';
import { Alert } from "@alert";
import ApiService from "@services/apiService";
import { BookItem } from "./book-item";

function Book() {
    const
        user = cookie.load('user') ? cookie.load('user')['user'] : null,
        [ books, setBooks ] = useState([]),
        [ loading, setLoading ] = useState(true),
        [ result, setResult ] = useState({
            flag: false,
            message: '',
            color: 'success'
        }),
        [ toggle, setToggle ] = useState(true);

    useEffect(() => {
        (new ApiService()).getBooks()
            .then(books => {
                setLoading(false);
                books.map((book) => {
                    let { total, available } = book,
                        sum = total - available;

                    Object.assign(book, { stock: sum !== 0 });
                });
                setBooks(books);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    function printBooks(data) {
        return (
            <div className="book__container">
                {
                    data.map((item, key) => <BookItem setOrder={ setOrder } toggle={ toggle } key={ key } book={ item } />)
                }
            </div>
        )
    }

    function setOrder(book_id, quantity) {
        let data = {
            book_id,
            client_id: user.id,
            quantity,
            status: 0
        };

        setResult({ ...result, flag: true });

        (new ApiService()).setOrder(data)
            .then(res => {
                setResult({
                    ...result,
                    flag: false,
                    message: res.message
                });
            })
            .catch(err => {
                setLoading(false);
            });

    }

    function filter() {
        setToggle(!toggle);
    }

    return (
        <>
        <div className="book__toast">
            { result.flag ? <Progress /> : null }
            { result.message ? <Alert color={ result.color }>{ result.message }</Alert> : null }
        </div>
        <div className="book__nav">
            <div className="switcher">
                <span className="label">В наличии:</span>
                <label className="switch" >
                    <input type="checkbox" checked={ toggle }/>
                    <span className="slider round" onClick={ filter }  />
                </label>
            </div>
        </div>
        { loading ? <Progress /> : printBooks(books) }
        </>
    )
}

export { Book }