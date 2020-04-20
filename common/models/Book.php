<?php

namespace common\models;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Query;

/**
 * This is the model class for table "book".
 *
 * @property int $id
 * @property string $title
 * @property string $code
 * @property string $author
 * @property int|null $total
 * @property int|null $available
 * @property int $receipt_at
 * @property int $created_at
 * @property int $updated_at
 */
class Book extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'book';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['title', 'code', 'author', 'receipt_at', 'created_at', 'updated_at'], 'required'],
            [['total', 'available', 'receipt_at', 'created_at', 'updated_at'], 'default', 'value' => null],
            [['total', 'available', 'receipt_at', 'created_at', 'updated_at'], 'integer'],
            [['title', 'code', 'author'], 'string', 'max' => 255],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'title' => 'Title',
            'code' => 'Code',
            'author' => 'Author',
            'total' => 'Total',
            'available' => 'Available',
            'receipt_at' => 'Receipt At',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }

    public static function getUserBooks(int $userId)
    {
        return (new Query())
            ->from('book_delivery as bd')
            ->select('DISTINCT ON (bo.id) bd.issue_at, bd.created_at, bo.quantity as book_quantity, b.title as book_title, br.status, e.name as employee_name, e.surname as employee_surname, e.id as employee_id')
            ->where('bd.client_id = ' . $userId . ' AND bo.status = 1')
            ->leftJoin('book as b', 'b.id = bd.book_id')
            ->leftJoin('user as e', 'e.id = bd.employee_id')
            ->leftJoin('book_reference as br', 'br.id = bd.reference_id')
            ->leftJoin('book_order as bo', 'bo.client_id = bd.client_id AND bo.book_id = bd.book_id')
            ->all();
    }
}
