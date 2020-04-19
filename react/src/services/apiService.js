import cookie from 'react-cookies';

import { config } from '@config';
import { authHeader } from "@helpers/auth-header";

export default class ApiService {

    async getResource(url, options = null) {
        const res = await fetch(`${config.API_URL}${url}`, options);

        if (!res.ok)
            throw res;

        return await res.json();
    }

    login(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        return this.getResource(`/auth`, options);
    }

    getEmployees() {
        const options = {
            method: 'GET',
            headers: authHeader()
        };

        return this.getResource(`/v1/users?s[roles]=employee&fields=id,name,surname,position`, options);
    }

    createUser(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify(data)
        };

        return this.getResource(`/v1/users`, options);
    }

    updateUser(id, data) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify(data)
        };

        return this.getResource(`/v1/users/${id}`, options);
    }

    getUser(id) {
        const options = {
            method: 'GET',
            headers: authHeader(),
        };

        return this.getResource(`/v1/users/${id}?fields=id,username,name,surname,position,email,roles,passport_series`, options);
    }

    deleteUser(id) {
        const options = {
            method: 'DELETE',
            headers: authHeader(),
        };

        return this.getResource(`/v1/users/${id}`, options);
    }

    getBooks() {
        const options = {
            method: 'GET',
            headers: authHeader()
        };

        return this.getResource(`/v1/books`, options);
    }

    getBook(id) {
        const options = {
            method: 'GET',
            headers: authHeader(),
        };

        return this.getResource(`/v1/books/${id}`, options);
    }

    createBook(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify(data)
        };

        return this.getResource(`/v1/books`, options);
    }

    updateBook(id, data) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify(data)
        };

        return this.getResource(`/v1/books/${id}`, options);
    }

    deleteBook(id) {
        const options = {
            method: 'DELETE',
            headers: authHeader(),
        };

        return this.getResource(`/v1/books/${id}`, options);
    }

    getClients() {
        const options = {
            method: 'GET',
            headers: authHeader()
        };

        return this.getResource(`/v1/clients`, options);
    }

    getUserBooks(id) {
        const options = {
            method: 'GET',
            headers: authHeader()
        };

        return this.getResource(`/user-books/${id}`, options);
    }

    setOrder(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader().Authorization
            },
            body: JSON.stringify(data)
        };

        return this.getResource(`/v1/book-orders`, options);
    }

    getOrders() {
        const options = {
            method: 'GET',
            headers: authHeader()
        };

        return this.getResource(`/v1/book-orders`, options);
    }

    deleteOrder(id) {
        const options = {
            method: 'DELETE',
            headers: authHeader(),
        };

        return this.getResource(`/v1/book-orders/${id}`, options);
    }

    static setUser(data) {
        return new Promise((resolve, reject) => {
            if (typeof data !== 'object' || Array.isArray(data))
                return reject(new Error());

            return resolve(cookie.save('user', data));
        });
    }

};