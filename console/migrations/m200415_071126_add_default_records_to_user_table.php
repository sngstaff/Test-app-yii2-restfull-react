<?php

use yii\db\Migration;
use common\models\User;

class m200415_071126_add_default_records_to_user_table extends Migration
{
    public function up()
    {
        # admin
        $this->insert('{{%user}}', [
            'username' => 'admin',
            'auth_key' => Yii::$app->security->generateRandomString(),
            'password_hash' => Yii::$app->security->generatePasswordHash('admin'),
            'password_reset_token' => null,
            'email' => 'admin@example.com',

            'status' => User::STATUS_ACTIVE,
            'created_at' => time(),
            'updated_at' => time(),

            'roles' => User::ROLE_ADMIN,
            'name' => 'Администратор',
            'surname' => null,
            'position' => null,
            'passport_series' => null,
        ]);

        #employee
        $this->insert('{{%user}}', [
            'username' => 'employee',
            'auth_key' => Yii::$app->security->generateRandomString(),
            'password_hash' => Yii::$app->security->generatePasswordHash('employee'),
            'password_reset_token' => null,
            'email' => 'employee@example.com',

            'status' => User::STATUS_ACTIVE,
            'created_at' => time(),
            'updated_at' => time(),

            'roles' => User::ROLE_EMPLOYEE,
            'name' => 'Сотрудник',
            'surname' => null,
            'position' => null,
            'passport_series' => null,
        ]);

        #client
        $this->insert('{{%user}}', [
            'username' => 'client',
            'auth_key' => Yii::$app->security->generateRandomString(),
            'password_hash' => Yii::$app->security->generatePasswordHash('client'),
            'password_reset_token' => null,
            'email' => 'client@example.com',

            'status' => User::STATUS_ACTIVE,
            'created_at' => time(),
            'updated_at' => time(),

            'roles' => User::ROLE_CLIENT,
            'name' => 'Клиент',
            'surname' => null,
            'position' => null,
            'passport_series' => null,
        ]);
    }

    public function down()
    {
        $this->delete('{{%user}}', ['id' => 1]);
        $this->delete('{{%user}}', ['id' => 2]);
        $this->delete('{{%user}}', ['id' => 3]);
    }
}
