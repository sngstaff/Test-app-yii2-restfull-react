<?php

namespace console\controllers;

use Yii;
use yii\console\Controller;

class RbacController extends Controller
{
    public function actionInit()
    {
        $auth = Yii::$app->authManager;
        $auth->removeAll();

        // добавляем разрешения для работы с сотрудником
        $createEmployee = $auth->createPermission('createEmployee');
        $createEmployee->description = 'Добавление сотрудника';
        $auth->add($createEmployee);

        $updateEmployee = $auth->createPermission('updateEmployee');
        $updateEmployee->description = 'Обновить данные сотруднка';
        $auth->add($updateEmployee);

        $deleteEmployee = $auth->createPermission('deleteEmployee');
        $deleteEmployee->description = 'Удалить сотрудника';
        $auth->add($deleteEmployee);

        #--------------------------------------------------------------------

        // добавляем разрешения для работы с клиентом
        $createClient = $auth->createPermission('createClient');
        $createClient->description = 'Добавление клиента';
        $auth->add($createClient);

        $updateClient = $auth->createPermission('updateClient');
        $updateClient->description = 'Обновить данные клиента';
        $auth->add($updateClient);

        $deleteClient = $auth->createPermission('deleteClient');
        $deleteClient->description = 'Удалить клиента';
        $auth->add($deleteClient);

        #--------------------------------------------------------------------

        // добавляем разрешения для работы с книгами
        $createBook = $auth->createPermission('createBook');
        $createBook->description = 'Добавление книги';
        $auth->add($createBook);

        $updateBook = $auth->createPermission('updateBook');
        $updateBook->description = 'Обновить книгу';
        $auth->add($updateBook);

        $deleteBook = $auth->createPermission('deleteBook');
        $deleteBook->description = 'Удалить книгу';
        $auth->add($deleteBook);

        $deliveryBook = $auth->createPermission('deliveryBook');
        $deliveryBook->description = 'Выдать книгу';
        $auth->add($deliveryBook);

        $returnBook = $auth->createPermission('returnBook');
        $returnBook->description = 'Возврат книги';
        $auth->add($returnBook);

        $getBook = $auth->createPermission('getBook');
        $getBook->description = 'Получить книгу';
        $auth->add($getBook);

        #------------------------------roles---------------------------------

        // доабвляем роль "employee"
        $employee = $auth->createRole('employee');
        $auth->add($employee);
        # работа с клиентом
        $auth->addChild($employee, $createClient);
        $auth->addChild($employee, $updateClient);
        $auth->addChild($employee, $deleteClient);
        # работа с книгами
        $auth->addChild($employee, $createBook);
        $auth->addChild($employee, $updateBook);
        $auth->addChild($employee, $deleteBook);
        $auth->addChild($employee, $deliveryBook);
        $auth->addChild($employee, $returnBook);
        $auth->addChild($employee, $getBook);

        // доабвляем роль "client"
        $client = $auth->createRole('client');
        $auth->add($client);
        $auth->addChild($client, $returnBook);
        $auth->addChild($client, $getBook);

        // доабвляем роль "Админ"
        $admin = $auth->createRole('admin');
        $auth->add($admin);
        # работа с сотрудником
        $auth->addChild($admin, $createEmployee);
        $auth->addChild($admin, $updateEmployee);
        $auth->addChild($admin, $deleteEmployee);
        $auth->addChild($admin, $employee);
        # работа с клиентом
        $auth->addChild($admin, $client);
    }
}