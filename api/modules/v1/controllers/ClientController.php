<?php

namespace api\modules\v1\controllers;


use common\models\BookOrder;
use yii\db\Query;
use yii\rest\ActiveController;
use Yii;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBearerAuth;
use yii\web\ServerErrorHttpException;
use api\modules\v1\models\UserSearch;
use common\models\User;
use yii\filters\Cors;

class ClientController extends ActiveController
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
                    'actions' => ['create', 'update', 'delete'],
                    'roles' => [User::ROLE_ADMIN]
                ],
                [
                    'allow' => true,
                    'actions' => ['index', 'view'],
                    'roles' => [User::ROLE_ADMIN, User::ROLE_EMPLOYEE]
                ]
            ]
        ];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        unset($actions['index'], $actions['create'], $actions['delete']);

        return $actions;
    }

    public function actionIndex()
    {
        return (new Query())
            ->select('user.id, COUNT(bo.id) as count_books, user.name, user.surname, user.passport_series')
            ->from('user')
            ->where(['user.roles' => User::ROLE_CLIENT, 'user.status' => User::STATUS_ACTIVE])
            ->leftJoin('book_order bo', '"bo"."client_id" = "user"."id" AND bo.status = ' . BookOrder::STATUS_ISSUED)
            ->groupBy('user.id')
            ->all();
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
            return ['status' => 201, 'message' => 'Сотрудник успешно добавлен.'];
        } elseif (!$model->hasErrors()) {
            throw new ServerErrorHttpException('Не удалось создать объект по неизвестной причине');
        }

        return $model;
    }

    public function actionDelete($id)
    {
        if (User::findOne($id)->delete())
            return ['status' => 200, 'message' => 'Сотрудник успешно удален.'];

        return false;
    }
}