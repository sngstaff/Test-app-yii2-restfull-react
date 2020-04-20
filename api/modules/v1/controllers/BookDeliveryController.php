<?php

namespace api\modules\v1\controllers;


use common\models\Book;
use common\models\BookDelivery;
use common\models\BookOrder;
use yii\rest\ActiveController;
use yii\filters\Cors;
use yii\filters\auth\HttpBearerAuth;
use yii\web\ServerErrorHttpException;
use yii\filters\AccessControl;
use common\models\User;
use Yii;

class BookDeliveryController extends ActiveController
{
    public $modelClass = 'common\models\BookDelivery';

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
                    'roles' => [User::ROLE_EMPLOYEE]
                ]
            ]
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['create']);

        return $actions;
    }

    public function actionCreate()
    {
        $model = new BookDelivery();

        $model->employee_id = Yii::$app->user->id;
        $model->created_at = time();
        $model->updated_at = time();
        $model->issue_at = strtotime('+1 week');

        $orderId = Yii::$app->request->bodyParams['order_id'];
        $quantity = Yii::$app->request->bodyParams['quantity'];

        $model->load(Yii::$app->request->bodyParams, "");

        if ($model->save() && $model->validate()) {
            BookOrder::updateAll([
                'status' => BookOrder::STATUS_ISSUED,
                'updated_at' => time()
            ], ['=', 'id', $orderId]);

            $book = Book::findOne($model->book_id);
            $book->available += $quantity;
            $book->save();

            $response = Yii::$app->getResponse();
            $response->setStatusCode(200);
            return ['status' => 200, 'message' => 'Книга успешно выдана.'];
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Не удалось создать объект по неизвестной причине.');
        }

        return $model;
    }
}