import React from 'react';

import './breadcrumbs.css';

import { BreadcrumbsItem } from "./breadcrumbs-item";

function Breadcrumbs({ routes }) {
    return (
        <div className="breadcrumbs">
            <ul className="breadcrumbs__nav">
                <BreadcrumbsItem routes={ routes } />
            </ul>
        </div>
    )
}

export { Breadcrumbs }