import React from "react";

export const NotFound = ({ location }) => {
    return (
        <div className="layout__wrapper">
            <div className="not__found">
                <span className="not__found-title">Страница не найдена</span>
                <span className="not__found-text">
                    По вашему запросу <span className="not__found-request">{ location.pathname }</span> ничего не найдено.
                </span>
            </div>
            <h2>No match found for <code>{ location.pathname }</code></h2>
        </div>
    )
};