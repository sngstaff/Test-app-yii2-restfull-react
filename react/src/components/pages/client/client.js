import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, useFilters, useGlobalFilter, usePagination, useSortBy } from 'react-table';

import './client.css';

import { Breadcrumbs } from "@components/global";
import { Progress } from '@progress/linear';
import { Alert } from "@alert";
import ApiService from "@services/apiService";

const WITH_BOOK = 10;
const WITHOUT_BOOK = 11;

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

function SelectColumnFilter({ column: { filterValue, setFilter } }) {
    return (
        <select
            value={ filterValue }
            onChange={ e => {
                const val = e.target.value;
                setFilter(parseInt(val) || undefined);
            }}
        >
            <option value="">Все</option>
            <option value={ WITH_BOOK }>С книгами</option>
            <option value={ WITHOUT_BOOK }>Без книг</option>
        </select>
    )
}

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        state,
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
        data,
    }, useFilters, useGlobalFilter, useSortBy, usePagination);

    return (
        <div className="scroll-table">
            <table className="data__table" { ...getTableProps() }>
                <thead className="data__table-head">
                <tr className="data__table-head__actions">
                    <th colSpan="1">
                        <div className="actions">
                            <GlobalFilter
                                globalFilter={ state.globalFilter }
                                setGlobalFilter={ setGlobalFilter }
                            />
                            { headerGroups.map(headerGroup => (
                                headerGroup.headers.map((column, key) => {
                                    if (column.id === "count_books" && column.filter)
                                        return <div key={ key } className="data__table-action__search">{column.render('Filter')}</div>
                                })
                            )) }
                        </div>
                    </th>
                    <th colSpan="5">
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
                    <tr className="data__table-head__wrapper data__table-head__actions" { ...headerGroup.getHeaderGroupProps() }>
                        { headerGroup.headers.map(column => (
                            <th { ...column.getHeaderProps([{
                                    className: column.className
                            }]) }>
                                <span
                                    { ...column.getHeaderProps([
                                        column.getSortByToggleProps()
                                    ])}
                                    className="data__table-title"
                                >
                                    { column.render("Header") }
                                </span>
                            </th>
                        )) }
                    </tr>
                )) }
                </thead>
                <tbody className="data__table-body" { ...getTableBodyProps() }>
                { page.length !== 0 ? page.map((row) => {
                    prepareRow(row);
                    return (
                        <tr className={"data__table-body__wrapper"} { ...row.getRowProps() }>
                            { row.cells.map(cell => {
                                return <td className="data__table-body__item" { ...cell.getCellProps() }>{ cell.render("Cell") }</td>;
                            }) }
                        </tr>
                    );
                }) : (<tr className="data__table-body__wrapper">
                    <td className="data__table-body__item" colSpan="3">Нет данных</td>
                </tr>) }
                </tbody>
            </table>
        </div>
    );
}

function filterBooks(rows, id, filterValue) {
    return rows.filter(row => {
        const rowValue = row.values[id];

        switch (filterValue) {
            case WITH_BOOK:
                return rowValue >= 1;
            case WITHOUT_BOOK:
                return rowValue <= 0;
        }
    })
}

function Client() {
    const
        breadcrumbs = [{ link: '/clients', name: 'Клиенты' }],
        [ users, setUsers ] = useState([]),
        [ loading, setLoading ] = useState(true),
        [ error, setError ] = useState(false),
        [ message, setMessage ] = useState('');

    useEffect(() => {
        getList()
    }, []);

    function getList() {
        (new ApiService()).getClients()
            .then(res => {
                setLoading(false);
                setUsers(res);
            })
            .catch(err => {
                if (err.message.search('fetch') > -1 ) {
                    setLoading(false);
                    setError(true);
                    setMessage('Повторите попытку позже');
                }
            })
    }

    function deleteUser(id) {
        let flag = confirm("Вы действительно хотите удалить?");

        if (!flag)
            return false;

        setLoading(true);
        (new ApiService()).deleteUser(id)
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
                    getList();
                    setMessage(res.message);
                }
            })
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Клиент',
                accessor: ({ name, surname }) => name + ' ' + surname,
                className: 'data__table-head__item',
                Cell: ({ cell }) => {
                    let { original : user } = cell.row;
                    return (
                        <NavLink to={`/client/${user.id}/books`}>
                            { user.name } { user.surname }
                        </NavLink>
                    )
                },
                Filter: false,
            },
            {
                Header: 'Серия и номер пасспорта',
                accessor: 'passport_series',
                className: 'data__table-head__item',
                Filter: false,
            },
            {
                Header: 'Кол-во книг',
                accessor: 'count_books',
                className: 'data__table-head__item',
                Filter: SelectColumnFilter,
                filter: filterBooks,
            },
            {
                Header: 'Операции',
                accessor: ({ id }) => (
                    <div className="data__table-operations text-center">
                        <NavLink to={`/client/${id}/books`} title="Посмотреть книги">
                            <i className="fa fa-book" />
                        </NavLink>
                        <NavLink to={`/clients/edit/${id}`} title="Редактировать пользователя">
                            <i className="fa fa-pencil" />
                        </NavLink>
                        <span className="icon-delete" title="Удалить пользователя" onClick={ () => deleteUser(id) }><i className="fa fa-trash" /></span>
                    </div>
                ),
                className: 'data__table-head__item text-center item-operations',
                Filter: false,
            }
        ]
    );

    return (
        <>
        <Breadcrumbs routes={ breadcrumbs } />
        { message && !error ? <Alert color="success">{ message }</Alert> : null }
        { error ? <Alert color="error">{ message }</Alert> : null }
        <div className="layout__wrapper">
            <div className="layout__wrapper-header">
                <NavLink to="/clients/create" className="btn-low">Добавить клиента</NavLink>
            </div>
            <div className="layout__wrapper-title">
                <span className="title">Список клинтов</span>
            </div>
            { loading ? <Progress /> : <Table columns={ columns } data={ users } /> }
        </div>
        </>
    )
}

export { Client }