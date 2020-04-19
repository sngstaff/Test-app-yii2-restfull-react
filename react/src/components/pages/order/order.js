import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, useGlobalFilter, usePagination, useSortBy } from 'react-table';

import './order.css';

import { Breadcrumbs } from "@components/global";
import { Progress } from '@progress/linear';
import { Alert } from "@alert";
import ApiService from "@services/apiService";
import { config } from "@config";

function GlobalFilter({ globalFilter, setGlobalFilter }) {
    return (
        <div className="data__table-action__search">
            <input
                className="search"
                value={ globalFilter || '' }
                onChange={ e => {
                    setGlobalFilter(e.target.value || undefined)
                } }
                placeholder={ `Поиск..` }
            />
        </div>
    )
}

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize }
    } = useTable({
        columns,
        data
    }, useGlobalFilter, useSortBy, usePagination);

    return (
        <div className="scroll-table">
            <table className="data__table" { ...getTableProps() }>
                <thead className="data__table-head">
                <tr className="data__table-head__actions">
                    <th colSpan="2">
                        <GlobalFilter
                            preGlobalFilteredRows={ preGlobalFilteredRows }
                            globalFilter={ state.globalFilter }
                            setGlobalFilter={ setGlobalFilter }
                        />
                    </th>
                    <th colSpan="6">
                        <div className="data__table-action__pagination">
                            <div className="lines">
                                <span className="viewed">
                                    Показано:
                                </span>
                                <select
                                    value={ pageSize }
                                    onChange={ e => {
                                        setPageSize(Number(e.target.value))
                                    } }
                                >
                                    { [10, 20, 30, 50, 75, 100].map(pageSize => (
                                        <option key={ pageSize } value={ pageSize }>
                                            { pageSize }
                                        </option>
                                    )) }
                                </select>
                            </div>
                            <div className="divider" />
                            <div className="nav">
                                <button className="start-page" onClick={() => gotoPage(0)} disabled={!canPreviousPage}><i className="fa fa-toggle-left" /></button>
                                <button onClick={() => previousPage()} disabled={!canPreviousPage}><i className="fa fa-caret-left" /></button>
                                <div className="data__table-action__goto"><input type="number" value={pageIndex + 1} onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    gotoPage(page)
                                }}/>
                                    из
                                    &nbsp;
                                    { pageOptions.length }
                                </div>
                                <button onClick={() => nextPage()} disabled={!canNextPage}><i className="fa fa-caret-right" /></button>
                                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}><i className="fa fa-toggle-right" /></button>
                            </div>
                        </div>
                    </th>
                </tr>
                { headerGroups.map(headerGroup => (
                    <tr className="data__table-head__wrapper" { ...headerGroup.getHeaderGroupProps() }>
                        { headerGroup.headers.map(column => (
                            <th { ...column.getHeaderProps([
                                column.getSortByToggleProps(),
                                {
                                    className: column.className
                                }
                            ]) }><span className="data__table-title">{ column.render("Header") }</span></th>
                        )) }
                    </tr>
                )) }
                </thead>
                <tbody className="data__table-body" { ...getTableBodyProps() }>
                { page.length !== 0 ? page.map((row) => {
                    prepareRow(row);
                    let { active } = row.original;
                    return (
                        <tr className={"data__table-body__wrapper " + (active === "0" ? " red__line" : "")} { ...row.getRowProps() }>
                            { row.cells.map(cell => {
                                return <td className="data__table-body__item" { ...cell.getCellProps() }>{ cell.render("Cell") }</td>;
                            }) }
                        </tr>
                    );
                }) : (<tr className="data__table-body__wrapper">
                    <td className="data__table-body__item" colSpan="8">Нет данных</td>
                </tr>) }
                </tbody>
            </table>
        </div>
    );
}

function Order() {
    const
        breadcrumbs = [{ name: 'Мои заказы' }],
        [ orders, setOrders ] = useState([]),
        [ loading, setLoading ] = useState(true),
        [ error, setError ] = useState(false),
        [ message, setMessage ] = useState('');

    useEffect(() => {
        (new ApiService()).getOrders()
            .then(res => {
                setLoading(false);
                setOrders(res);
            })
            .catch(err => {
                if (err.message.search('fetch') > -1 ) {
                    setLoading(false);
                    setError(true);
                    setMessage('Повторите попытку позже');
                }
            })
    }, []);

    function deleteOrder(id) {
        let flag = confirm("Вы действительно хотите отменить заказ?");

        if (!flag)
            return false;

        (new ApiService()).deleteOrder(id)
            .then(res => {
                if (res.status === 200) {
                    setOrders(orders.filter((el) => el.order_id !== id));
                    setMessage(res.message);
                }
            })
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Номер',
                accessor: ({ order_id }) => (<div className="text-center">{ order_id }</div>),
                className: 'data__table-head__item item-number text-center',
            },
            {
                Header: 'Книга',
                accessor: 'book_title',
                className: 'data__table-head__item'
            },
            {
                Header: 'Автор',
                accessor: 'book_author',
                className: 'data__table-head__item'
            },
            {
                Header: 'Артикул',
                accessor: 'book_code',
                className: 'data__table-head__item'
            },
            {
                Header: 'Кол-во',
                accessor: 'quantity',
                className: 'data__table-head__item'
            },
            {
                Header: 'Дата заказа',
                accessor: ({ order_at }) => new Date(order_at*1000).toLocaleDateString("ru-RU") + ' ' + new Date(order_at*1000).toLocaleTimeString("ru-RU"),
                className: 'data__table-head__item'
            },
            {
                Header: 'Статус',
                accessor: ({ status }) => {
                    switch(status) {
                        case config.STATUS_WAIT:
                            return 'В обработке';
                        case config.STATUS_ISSUED:
                            return 'Выдан';
                        default:
                            return 'Не известно'
                    }
                },
                className: 'data__table-head__item'
            },
            {
                Header: 'Операции',
                accessor: ({ order_id }) => (<span className="btn-cancel"  onClick={ () => deleteOrder(order_id) }>Отменить</span>),
                className: 'data__table-head__item'
            }
        ]
    );

    return (
        <>
        <Breadcrumbs routes={ breadcrumbs } />
        { message && !error ? <Alert color="success">{ message }</Alert> : null }
        { error ? <Alert color="error">{ message }</Alert> : null }
        <div className="layout__wrapper">
            <div className="layout__wrapper-title">
                <span className="title">Список заказов</span>
            </div>
            { loading ? <Progress /> : <Table columns={ columns } data={ orders } /> }
        </div>
        </>
    )
}

export { Order }