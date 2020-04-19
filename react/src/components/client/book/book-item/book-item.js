import React, { useState } from "react";

export function BookItem({ book, setOrder, toggle }){
    const
        [ quantity, setQuantity ] = useState(1),
        [ error, setError ] = useState(false),
        [ message, setMessage ] = useState('');

    function inStock() {
        let { total, available } = book,
            sum = total - available;

        return sum !== 0;
    }

    /** @todo: release by function **/
    function togglePopup(max) {
        return (
            <div className="book-popup">
                <input type="number" max={ max } defaultValue={ 1 } min={ 1 } />
                <span>Get book</span>
            </div>
        )
    }

    function set(book_id, quantity) {
        let { total, available } = book,
            sum = total - available;

        if (quantity > sum) {
            setError(true);
            setMessage('Максимальное кол-во: ' + sum);
        } else if (quantity === 0) {
            setError(true);
            setMessage('Минимальное кол-во: 1');
        } else {
            setError(false);
            setOrder(book_id, quantity);
        }
    }

    function item() {
        if (toggle && book.stock || !toggle && !book.stock) {
            return (
                <div className="book-item">
                    <div className="book__thumbnail">
                        <div className="thumbnail" />
                    </div>
                    <div className="book__header">
                        <span className="book-title">{ book.title }</span>
                    </div>
                    <div className="book__body">
                        <div className="item">
                            <span className="text">Автор:</span>
                            <b>{ book.author }</b>
                        </div>
                        <div className="item">
                            <span className="text">Артикул:</span>
                            <b>{ book.code }</b>
                        </div>
                        <div className="item">
                            <span className="text">В наличии:</span>
                            <b>{ inStock() ? 'Да' : 'Нет' }</b>
                        </div>
                    </div>
                    { inStock() ? (
                        <>
                        <div className="book__footer">
                            <div>
                                <span className="text">Кол-во:</span>
                                <input type="number" defaultValue={ 1 } min={ 1 } max={ book.total - book.available} onChange={ (e) => setQuantity(e.target.value) } />
                            </div>
                            <span className="btn-book" onClick={ () => set(book.id, parseInt(quantity)) }>Заказать</span>
                        </div>
                        <div className="error">
                            { error ? <span className="err-message">{ message }</span> : null }
                        </div>
                        </>
                    ) : null }
                </div>
            )
        }

        return false;
    }

    return (
        <>
        { item() }
        </>
    )
}