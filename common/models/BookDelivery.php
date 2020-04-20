<?php

namespace common\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Query;

/**
 * This is the model class for table "book_delivery".
 *
 * @property int $id
 * @property int $book_id
 * @property int $employee_id
 * @property int $client_id
 * @property int $reference_id
 * @property int $issue_at
 * @property int $created_at
 * @property int $updated_at
 */
class BookDelivery extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'book_delivery';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['book_id', 'employee_id', 'client_id', 'reference_id', 'issue_at', 'created_at', 'updated_at'], 'required'],
            [['book_id', 'employee_id', 'client_id', 'reference_id', 'issue_at', 'created_at', 'updated_at'], 'default', 'value' => null],
            [['book_id', 'employee_id', 'client_id', 'reference_id', 'issue_at', 'created_at', 'updated_at'], 'integer'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'book_id' => 'Book ID',
            'employee_id' => 'Employee ID',
            'client_id' => 'Client ID',
            'reference_id' => 'Reference ID',
            'issue_at' => 'Issue At',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    public static function getUserBooks(int $userId)
    {
        return (new Query())
            ->from('book_delivery as bd')
            ->select('DISTINCT ON (bo.id) bd.id as delivery_id, b.title as book_title, b.author as book_author, b.code as book_code, bo.id as order_id, bo.quantity, b.id as book_id')
            ->where('bd.client_id = ' . $userId . ' AND bo.status = ' . BookOrder::STATUS_ISSUED)
            ->leftJoin('book b', 'b.id = bd.book_id')
            ->leftJoin('book_order bo', 'bo.client_id = bd.client_id')
            ->all();
    }

    public static function getReturnedBooks()
    {
        return (new Query())
            ->from('book_delivery as bd')
            ->select('DISTINCT ON (bo.id) bd.id as delivery_id, b.title as book_title, b.author as book_author, b.code as book_code, bo.id as order_id, bo.quantity, b.id as book_id, c.name as client_name, c.surname as client_surname')
            ->where('bo.status = ' . BookOrder::STATUS_ISSUED)
            ->leftJoin('user c', 'c.id = bd.client_id')
            ->leftJoin('book b', 'b.id = bd.book_id')
            ->leftJoin('book_order bo', 'bo.client_id = bd.client_id')
            ->all();
    }
}
