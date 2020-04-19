<?php

namespace api\modules\v1\controllers;


use common\models\User;
use Yii;
use common\models\Book;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBearerAuth;
use yii\rest\ActiveController;
use yii\web\ServerErrorHttpException;
use yii\filters\Cors;

class BookController extends ActiveController
{
    public $modelClass = 'common\models\Book';

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
                    'actions' => ['create', 'update', 'delete'],
                    'roles' => [User::ROLE_ADMIN, User::ROLE_EMPLOYEE]
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'view'],
                    'roles' => ['@']
                ]
            ]
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['create'], $actions['delete']);

        return $actions;
    }

    public function actionCreate()
    {
        $model = new Book();

        $model->created_at = time();
        $model->updated_at = time();
        $model->available = 0;

        $model->load(Yii::$app->getRequest()->getBodyParams(), '');

        if ($model->save()) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            return ['status' => 201, 'message' => 'Книга успешно добавлена.'];
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Не удалось создать объект по неизвестной причине.');
        }

        return $model;
    }

    public function actionDelete($id)
    {
        if (Book::findOne($id)->delete())
            return ['status' => 200, 'message' => 'Книга успешно удалена.'];

        return false;
    }
}