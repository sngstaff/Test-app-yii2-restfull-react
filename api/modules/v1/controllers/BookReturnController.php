<?php

namespace api\modules\v1\controllers;


use common\models\BookReturn;
use Yii;
use yii\rest\ActiveController;
use yii\filters\Cors;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\AccessControl;
use common\models\Book;
use common\models\User;
use common\models\BookDelivery;
use common\models\BookOrder;

class BookReturnController extends ActiveController
{
    public $modelClass = 'common\models\BookReturn';

    public static function allowedDomains() {
        return [
            '*',
            'http://localhost:8080'
        ];
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        unset($behaviors['authenticator']);

        $behaviors['corsFilter'] = [
            'class' => Cors::class,
            'cors' => [
                'Origin'                            => self::allowedDomains(),
                'Access-Control-Request-Method'     => ['*'],
                'Access-Control-Max-Age'            => 3600,
                'Access-Control-Allow-Credentials'  => false,
                'Access-Control-Request-Headers'    => ['*']
            ],
        ];

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
        ];

        $behaviors['access'] = [
            'class' => AccessControl::class,
            'rules' => [
                [
                    'allow' => true,
                    'actions' => ['create'],
                    'roles' => [User::ROLE_CLIENT]
                ],
                [
                    'allow' => true,
                    'actions' => ['update'],
                    'roles' => [User::ROLE_EMPLOYEE]
                ],
                [
                    'allow' => true,
                    'actions' => ['index'],
                    'roles' => [User::ROLE_EMPLOYEE, User::ROLE_CLIENT]
                ],
            ]
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['create'], $actions['index']);

        return $actions;
    }

    public function actionIndex()
    {
        if (Yii::$app->user->can('client')) {
            return BookDelivery::getUserBooks(Yii::$app->user->id);
        } else if (Yii::$app->user->can('employee')) {
            return BookDelivery::getReturnedBooks();
        }

        return null;
    }

    public function actionCreate()
    {
        $model = new BookReturn();

        $model->client_id = Yii::$app->user->id;
        $model->created_at = time();
        $model->updated_at = time();
        $model->reference_id = 0;

        $quantity = Yii::$app->request->bodyParams['quantity'];
        $bookId = Yii::$app->request->bodyParams['book_id'];
        $orderId = Yii::$app->request->bodyParams['order_id'];

        $model->load(Yii::$app->request->bodyParams, '');

        if ($model->save() && $model->validate()) {
            BookOrder::updateAll([
                'status' => BookOrder::STATUS_RETURNED,
                'updated_at' => time()
            ], ['=', 'id', $orderId]);

            $book = Book::findOne($bookId);
            $book->available -= $quantity;
            $book->save();

            $response = Yii::$app->getResponse();
            $response->setStatusCode(200);
            return ['status' => 200, 'message' => 'Книга возвращена.'];
        }

        return $model;
    }
}