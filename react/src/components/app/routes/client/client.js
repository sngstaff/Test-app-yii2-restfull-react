import React from 'react';
import { Main } from '@layout';
import { NotFound } from "@layout/main/404";

/* components or pages */
import { Book } from "@components/client";
import { Order } from "@pages";

const Test = () => {
    return (
        <h1>test</h1>
    )
};

export const Client = [
    {
        layout: Main,
        isPrivate: "true",
        path: "/",
        component: Book
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/orders",
        component: Order
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/returns",
        component: Test
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "*",
        component: NotFound
    }
];