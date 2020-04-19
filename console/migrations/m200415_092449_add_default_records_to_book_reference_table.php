<?php

use yii\db\Migration;

class m200415_092449_add_default_records_to_book_reference_table extends Migration
{
    public function up()
    {
        $this->insert('{{%book_reference}}', [
            'status' => 'Очень хорошее состояние',
            'created_at' => time(),
            'updated_at' => time()
        ]);
        $this->insert('{{%book_reference}}', [
            'status' => 'Хорошее состояние',
            'created_at' => time(),
            'updated_at' => time()
        ]);
        $this->insert('{{%book_reference}}', [
            'status' => 'Удовлетворительное состояние',
            'created_at' => time(),
            'updated_at' => time()
        ]);
        $this->insert('{{%book_reference}}', [
            'status' => 'Плохое состояние',
            'created_at' => time(),
            'updated_at' => time()
        ]);
    }

    public function down()
    {
        $this->delete('{{%book_reference}}', ['id' => 1]);
        $this->delete('{{%book_reference}}', ['id' => 2]);
        $this->delete('{{%book_reference}}', ['id' => 3]);
        $this->delete('{{%book_reference}}', ['id' => 4]);
    }
}
