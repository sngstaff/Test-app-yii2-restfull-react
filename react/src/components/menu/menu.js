import React from "react";
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
        <ul className="nav">
            {
                list.map((item, key) =>
                    <MenuItem item={item} key={key} />
                )
            }
        </ul>
    )
}

export { Menu };