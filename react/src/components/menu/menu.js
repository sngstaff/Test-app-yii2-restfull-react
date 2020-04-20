import React, { useState } from "react";
import cookie from "react-cookies";

import "./menu.css";

import { Admin } from "./admin";
import { Client } from "./client";
import { Employee } from "./employee";
import { config } from '@config';
import { MenuItem } from "./menu-item";

function Menu() {
    let
        role = cookie.load('user')['user']['roles'],
        [ toggle, setToggle ] = useState(false),
        list = [];

    switch (role) {
        case config.ROLE_ADMIN:
            list = Admin;
            break;
        case config.ROLE_EMPLOYEE:
            list = Employee;
            break;
        case config.ROLE_CLIENT:
            list = Client;
            break;
        default:
            return (
                <span>No data</span>
            );
    }

    return (
        <div className="collapse">
            <button className="toggle" onClick={ () => setToggle(!toggle) } aria-expanded={ toggle } ><span className="burger" /></button>
            <ul className={`nav` + (toggle ? ' show' : '') }>
                {
                    list.map((item, key) =>
                        <MenuItem item={item} key={key} />
                    )
                }
            </ul>
        </div>
    )
}

export { Menu };