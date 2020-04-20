import React from 'react';
import { Main } from '@layout';
import { NotFound } from "@layout/main/404";

/* components or pages */
import { Book, Client } from "@pages";
import { Create as bookCreate, Edit as bookEdit, UserBooks } from "@pages/book";
import { Order, BookReturn } from "@components/employee";
import { Create as clientCreate, Edit as clientEdit } from "@pages/client";

export const Employee = [
    {
        layout: Main,
        isPrivate: "true",
        path: "/",
        component: Order
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/books",
        component: Book
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/books/create",
        component: bookCreate
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/books/edit/:id",
        component: bookEdit
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/clients",
        component: Client
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/clients/create",
        component: clientCreate
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/clients/edit/:id",
        component: clientEdit
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/client/:id/books",
        component: UserBooks
    },
    {
        layout: Main,
        isPrivate: "true",
        path: '/returns',
        component: BookReturn
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "*",
        component: NotFound
    }
];