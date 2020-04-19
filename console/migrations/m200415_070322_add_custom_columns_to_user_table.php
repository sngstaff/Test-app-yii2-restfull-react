<?php

use yii\db\Migration;
use common\models\User;

class m200415_070322_add_custom_columns_to_user_table extends Migration
{
    public function up()
    {
        $this->addColumn('{{%user}}', 'roles', $this->string()->defaultValue(User::ROLE_CLIENT));
        $this->addColumn('{{%user}}', 'name', $this->string()->notNull());
        $this->addColumn('{{%user}}', 'surname', $this->string()->null());
        $this->addColumn('{{%user}}', 'position', $this->string()->null());
        $this->addColumn('{{%user}}', 'passport_series', $this->integer(10)->null());
    }

    public function down()
    {
        $this->dropColumn('{{%user}}', 'roles');
        $this->dropColumn('{{%user}}', 'name');
        $this->dropColumn('{{%user}}', 'surname');
        $this->dropColumn('{{%user}}', 'position');
        $this->dropColumn('{{%user}}', 'passport_series');
    }
}
