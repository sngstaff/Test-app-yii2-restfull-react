<?php

namespace api\controllers;


use api\models\LoginForm;
use Yii;
use yii\filters\Cors;
use yii\rest\Controller;

class SiteController extends Controller
{
    public static function allowedDomains() {
        return [
            '*',
            'http://localhost:8080',
            'http://localhost:3000'
        ];
    }

    public function behaviors()
    {
        $behaviors = parent::behaviors();

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

        return $behaviors;
    }

    public function actionLogin()
    {
        $model = new LoginForm();
        $model->load(Yii::$app->request->bodyParams, '');

        if ($user = $model->login()) {
            return $user;
        } else {
            return $model;
        }
    }

    protected function verbs()
    {
        return [
            'login' => ['OPTIONS', 'POST'],
        ];
    }
}