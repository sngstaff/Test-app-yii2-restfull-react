import React, { useState } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

/* css */
import '@static/fonts/fonts.css';
import '@static/css/font-awesome.min.css';
import '@static/css/global.css';

/* Routes */
import { CustomRoute } from "./custom-router";
import { Admin, Site, Client, Employee } from './routes';
import { config } from "@config";

function App() {

    const [ userObj, setUserObj ] = useState(cookie.load('user'));

    function updateUser() {
        if (cookie.load('user')) {
            setUserObj(cookie.load('user'));
        }
    }

    function accessRoute() {
        const role = userObj ? userObj.user.roles : '';
        let routes = [];

        switch (role) {
            case config.ROLE_ADMIN:
                routes = Admin;
                break;
            case config.ROLE_EMPLOYEE:
                routes = Employee;
                break;
            case config.ROLE_CLIENT:
                routes = Client;
                break;
            default:
                return (
                    <>
                        <Site updateUser = { updateUser } />

                        <Redirect to = {{ pathname: "/login" }} />
                    </>
                );
        }

        return (
            routes.map((item, key) =>
                <CustomRoute
                    Layout={ item.layout }
                    isPrivate={ item.isPrivate }
                    exact
                    path={ item.path }
                    component={ item.component }
                    key={ key }
                />
            )
        )
    }

    return (
        <Switch>

            { accessRoute() }

        </Switch>
    )
}

export  { App };