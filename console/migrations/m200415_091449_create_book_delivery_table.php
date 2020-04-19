<?php

use yii\db\Migration;

class m200415_091449_create_book_delivery_table extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('{{%book_delivery}}', [
            'id' => $this->primaryKey(),
            'book_id' => $this->integer()->notNull(),
            'employee_id' => $this->integer()->notNull(),
            'client_id' => $this->integer()->notNull(),
            'reference_id' => $this->integer()->notNull(),
            'issue_at' => $this->integer()->notNull(),
            'created_at' => $this->integer()->notNull(),
            'updated_at' => $this->integer()->notNull()
        ], $tableOptions);
    }

    public function down()
    {
        $this->dropTable('{{%book_delivery}}');
    }
}
