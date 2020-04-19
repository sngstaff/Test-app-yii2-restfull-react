import React from "react";
import { NavLink } from "react-router-dom";

export const MenuItem = ({ item } = props) => {
    return (
        <li className="nav-item">
            <NavLink to={ item.link } className="nav-link">{item.name}</NavLink>
        </li>
    )
};