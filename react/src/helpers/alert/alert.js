import React from 'react';

import './alert.css';

export const Alert = ({ children, color }) => {

    return (
        <>
        <div className={"alert alert-" + color}>
            { children }
            {/*<span className="close">&times;</span>*/}
        </div>
        </>
    )
};