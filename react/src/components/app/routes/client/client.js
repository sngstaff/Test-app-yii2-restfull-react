import React from 'react';
import { Main } from '@layout';
import { NotFound } from "@layout/main/404";

/* components or pages */
import { Book, BookReturn } from "@components/client";
import { Order } from "@pages";

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
        component: BookReturn
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "*",
        component: NotFound
    }
];