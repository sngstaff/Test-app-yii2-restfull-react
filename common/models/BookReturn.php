<?php

namespace common\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "book_return".
 *
 * @property int $id
 * @property int $delivery_id
 * @property int $client_id
 * @property int $reference_id
 * @property int $created_at
 * @property int $updated_at
 */
class BookReturn extends ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'book_return';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['delivery_id', 'client_id', 'reference_id', 'created_at', 'updated_at'], 'required'],
            [['delivery_id', 'client_id', 'reference_id', 'created_at', 'updated_at'], 'default', 'value' => null],
            [['delivery_id', 'client_id', 'reference_id', 'created_at', 'updated_at'], 'integer'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'delivery_id' => 'Delivery ID',
            'client_id' => 'Client ID',
            'reference_id' => 'Reference ID',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        ];
    }
}
