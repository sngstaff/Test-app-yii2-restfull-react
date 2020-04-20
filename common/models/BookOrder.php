<?php

namespace common\models;

use yii\db\ActiveRecord;
use yii\db\Query;

/**
 * This is the model class for table "book_order".
 *
 * @property int $id
 * @property int $book_id
 * @property int $client_id
 * @property int $status
 * @property int|null $quantity
 * @property int $created_at
 * @property int $updated_at
 */
class BookOrder extends ActiveRecord
{
    const STATUS_WAIT = 0;
    const STATUS_ISSUED = 1;
    const STATUS_RETURNED = 2;

    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'book_order';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['book_id', 'client_id', 'status', 'created_at', 'updated_at'], 'required'],
            [['book_id', 'client_id', 'status', 'quantity', 'created_at', 'updated_at'], 'default', 'value' => null],
            [['book_id', 'client_id', 'status', 'quantity', 'created_at', 'updated_at'], 'integer'],
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
            'client_id' => 'Client ID',
            'status' => 'Status',
            'quantity' => 'Quantity',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    public static function getUserOrders(int $userId)
    {
        return (new Query())
            ->from('book_order bo')
            ->select('bo.id as order_id, b.title as book_title, bo.quantity, bo.status, bo.created_at as order_at, b.code as book_code, b.author as book_author')
            ->leftJoin('book as b', 'bo.book_id = b.id')
            ->where('bo.client_id = ' . $userId)
            ->all();
    }

    public static function getOrders()
    {
        return (new Query())
            ->from('book_order bo')
            ->select('bo.id as order_id, b.id as book_id, b.title as book_title, bo.quantity, bo.status, bo.created_at as order_at, b.code as book_code, b.author as book_author, c.name as client_name, c.surname as client_surname, c.id as client_id')
            ->leftJoin('book as b', 'bo.book_id = b.id')
            ->leftJoin('user as c','c.id = bo.client_id')
            ->all();
    }
}
