import React from 'react';

import { CustomRoute } from '../../custom-router';
import { Site as Template } from '@layout';

import { Login } from '@pages/site/login';

function Site(props) {
    return (
        <>

        <CustomRoute
            Layout = { Template }
            isPrivate = "false"
            exact
            path = "/login"
            updateUser = { props.updateUser }
            component = { Login }  />

        </>
    )
}

export { Site }