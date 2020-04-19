<?php

namespace api\modules\v1\controllers;


use common\models\BookOrder;
use Yii;
use yii\db\Query;
use yii\rest\ActiveController;
use yii\filters\Cors;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\AccessControl;
use common\models\User;
use yii\web\ServerErrorHttpException;

class BookOrderController extends ActiveController
{
    public $modelClass = 'common\models\BookOrder';

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
                    'roles' => [User::ROLE_CLIENT, User::ROLE_EMPLOYEE]
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'delete', 'update'],
                    'roles' => [User::ROLE_ADMIN, User::ROLE_EMPLOYEE, User::ROLE_CLIENT]
                ]
            ]
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['create'], $actions['delete'], $actions['index']);

        return $actions;
    }

    public function actionIndex()
    {
        if (Yii::$app->user->can('client')) {
            return BookOrder::getUserOrders(Yii::$app->user->id);
        } else if (Yii::$app->user->can('employee'))
            return BookOrder::getOrders();

        return null;
    }

    public function actionCreate()
    {
        $model = new BookOrder();

        $model->created_at = time();
        $model->updated_at = time();

        $model->load(Yii::$app->request->bodyParams, "");

        if ($model->save() && $model->validate()) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            return ['status' => 201, 'message' => 'Ваш заказ успешно принят.'];
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Не удалось создать объект по неизвестной причине');
        }

        return $model;
    }

    public function actionDelete($id)
    {
        if (BookOrder::findOne($id)->delete())
            return ['status' => 200, 'message' => 'Заказ отменен'];

        return false;
    }
}