import React from 'react';
import { Main } from '@layout';
import { NotFound } from "@layout/main/404";

/* components or pages */
import { Book } from "@pages";
import { Create as bookCreate, Edit as bookEdit, UserBooks } from "@pages/book";

const Test = () => {
    return (
        <h1>test</h1>
    )
};

export const Employee = [
    {
        layout: Main,
        isPrivate: "true",
        path: "/",
        component: Test
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
        path: "*",
        component: NotFound
    }
];