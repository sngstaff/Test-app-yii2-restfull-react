import React from "react";
import cookie from "react-cookies";

import "./account.css";

function Account() {

    const user = cookie.load('user')['user'];

    return (
        <div className="account">
            <div className="account-inner">
                <div className="fio">{user.name} {user.surname}</div>
                <span className="nav-link cur-p" onClick={ () => { cookie.remove('user'); location.reload(); } }>(выйти)</span>
            </div>
        </div>
    )
}

export { Account }