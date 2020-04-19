import React from 'react';
import { NavLink } from 'react-router-dom';

export const BreadcrumbsItem = ({ routes }) => {

    const length = routes.length;

    return (
        <>
        <li className="breadcrumbs__nav-item">
            <NavLink className="breadcrumbs__nav-link" to="/"><i className="fa fa-home">&nbsp;</i></NavLink>
        </li>
        {
            routes.map((item, key) => {
                let lastItem = key + 1;
                return (
                    <li className="breadcrumbs__nav-item" key={ key }>
                        { lastItem === length ?
                            <span className="breadcrumbs__nav-link">{ item.name }</span>
                        :
                            <NavLink className="breadcrumbs__nav-link" to={ item.link }>{ item.name }</NavLink>
                        }

                    </li>
                )
            })
        }

        </>
    )
};