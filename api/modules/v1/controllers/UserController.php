<?php

namespace api\modules\v1\controllers;


use common\models\Book;
use yii\rest\ActiveController;
use Yii;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBearerAuth;
use yii\web\ServerErrorHttpException;
use api\modules\v1\models\UserSearch;
use common\models\User;
use yii\filters\Cors;

class UserController extends ActiveController
{
    public $modelClass = 'common\models\User';

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
                    'actions' => ['index', 'create', 'view', 'update', 'delete'],
                    'roles' => [User::ROLE_ADMIN]
                ],
                [
                    'allow' => true,
                    'actions' => ['user-books'],
                    'roles' => ['@']
                ]
            ]
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        unset($actions['create'], $actions['delete']);

        return $actions;
    }

    public function prepareDataProvider()
    {
        $searchModel = new UserSearch();
        return $searchModel->search(Yii::$app->request->queryParams);
    }

    public function actionCreate()
    {
        $model = new User();

        $params = Yii::$app->request->bodyParams;
        $model->setPassword($params['password']);
        $model->generateAuthKey();
        $model->status = User::STATUS_ACTIVE;
        $model->load($params, "");

        if ($model->save() && $model->validate()) {
            $response = Yii::$app->getResponse();
            $response->setStatusCode(201);
            return ['status' => 201, 'message' => 'Пользователь успешно добавлен.'];
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Не удалось создать объект по неизвестной причине');
        }

        return $model;
    }

    public function actionDelete($id)
    {
        if (User::findOne($id)->delete())
            return ['status' => 200, 'message' => 'Пользователь успешно удален.'];

        return false;
    }

    public function actionUserBooks(int $id)
    {
        return Book::getUserBooks($id);
    }


}