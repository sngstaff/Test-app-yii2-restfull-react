import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

export const CustomRoute = ({ component: Component, ...rest }) => {
    return (
        <Route { ...rest } render={props => {
            let { Layout, isPrivate } = rest,
                user = cookie.load('user');

            if (isPrivate === "false" && !user) {
                return Layout(<Component { ...props } { ...rest } />);
            } else if (isPrivate === "true" && user && rest.exact) {
                return (<Layout><Component { ...props } { ...rest } /></Layout>);
            } else if (isPrivate === "false" && user) {
                return <Redirect to={{pathname: "/"}}/>
            } else {
                return <Redirect to={{pathname: "/login"}}/>
            }
        }}/>
    )
};