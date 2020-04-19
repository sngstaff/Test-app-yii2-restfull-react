import React from "react";
import cookie from "react-cookies";
import { NavLink } from "react-router-dom";

import './main.css';

import { Account } from "./account/account";
import { Menu } from "../../components/menu";

function Main({ children }) {
    return (
        <>
        <div className="layout__header">
            <div className="layout__cell">
                <div className="main__navbar">
                    <div className="layout__header-column__left">
                        <div className="logotype">
                            <NavLink to="/" className="logo">DosLab</NavLink>
                        </div>
                        <Menu />
                    </div>
                    <div className="layout__header-column__right">
                        <Account />
                    </div>
                </div>
            </div>
        </div>

        <div className="layout__body">
            <div className="layout__cell layout__cell-body">
                { children }
            </div>
        </div>
        </>
    )
}

export { Main }