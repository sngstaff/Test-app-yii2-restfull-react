import React from 'react';
import { Main } from '@layout';
import { NotFound } from "@layout/main/404";

/* components or pages */
import { Employees } from "@components/admin";
import { Create as emplCreate, Edit as emplEdit } from "@components/admin/employees";
import { Create as clientCreate, Edit as clientEdit } from "@pages/client";
import { Book, Client } from "@pages";
import { Create as bookCreate, Edit as bookEdit, UserBooks } from "@pages/book";

const Test = () => {
    return (
        <h1>test</h1>
    )
};

export const Admin = [
    {
        layout: Main,
        isPrivate: "true",
        path: "/",
        component: Test
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/employees",
        component: Employees
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/employees/create",
        component: emplCreate
    },
    {
        layout: Main,
        isPrivate: "true",
        path: "/employees/edit/:id",
        component: emplEdit
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
        path: "*",
        component: NotFound
    }
];