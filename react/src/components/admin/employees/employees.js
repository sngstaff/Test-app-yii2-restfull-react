import React, { useState, useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTable, useGlobalFilter, usePagination, useSortBy } from 'react-table';

import './employees.css';

import { Breadcrumbs } from "@components/global";
import { Progress } from '@progress/linear';
import { Alert } from "@alert";
import ApiService from "@services/apiService";

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
                    <th colSpan="1">
                        <GlobalFilter
                            preGlobalFilteredRows={ preGlobalFilteredRows }
                            globalFilter={ state.globalFilter }
                            setGlobalFilter={ setGlobalFilter }
                        />
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
                    <td className="data__table-body__item" colSpan="3">Нет данных</td>
                </tr>) }
                </tbody>
            </table>
        </div>
    );
}

function Employees() {
    const
        breadcrumbs = [{ link: '/users', name: 'Сотрудники' }],
        [ users, setUsers ] = useState([]),
        [ loading, setLoading ] = useState(true),
        [ error, setError ] = useState(false),
        [ message, setMessage ] = useState('');

    useEffect(() => {
        getList()
    }, []);

    function getList() {
        (new ApiService()).getEmployees()
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
                Header: 'Сотрудник',
                accessor: ({ name, surname }) => name + ' ' + surname,
                className: 'data__table-head__item',
                Cell: ({ cell }) => {
                    let { original : user } = cell.row;
                    return (
                        <NavLink to={`/employees/edit/${user.id}`}>
                            { user.name } { user.surname }
                        </NavLink>
                    )
                }
            },
            {
                Header: 'Должность',
                accessor: ({ position }) => position,
                className: 'data__table-head__item'
            },
            {
                Header: 'Операции',
                accessor: ({ id }) => (
                    <div className="data__table-operations text-center">
                        <NavLink to={`/employees/edit/${id}`}>
                            <i className="fa fa-pencil" />
                        </NavLink>
                        <span className="icon-delete" onClick={ () => deleteUser(id) }><i className="fa fa-trash" /></span>
                    </div>
                ),
                className: 'data__table-head__item text-center item-operations'
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
                <NavLink to="/employees/create" className="btn-low">Добавить сотрудника</NavLink>
            </div>
            <div className="layout__wrapper-title">
                <span className="title">Список сотрудников</span>
            </div>
            { loading ? <Progress /> : <Table columns={ columns } data={ users } /> }
        </div>
        </>
    )
}

export { Employees }