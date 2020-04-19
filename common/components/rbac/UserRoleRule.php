<?php

namespace common\components\rbac;

use common\models\User;
use yii\helpers\ArrayHelper;
use yii\rbac\Rule;

class UserRoleRule extends Rule
{
    public $name = 'userRole';

    public function execute($userId, $item, $params)
    {
        $user = ArrayHelper::getValue($params, 'user', User::findOne($userId));

        if ($user) {
            $role = $user->role;

            switch ($item->name) {
                case 'admin':
                    return $role === User::ROLE_ADMIN;
                case 'employee':
                    return $role === User::ROLE_ADMIN || $role === User::ROLE_EMPLOYEE;
                case 'client':
                    return $role === User::ROLE_ADMIN || $role === User::ROLE_EMPLOYEE || User::ROLE_CLIENT;
            }
        }

        return false;
    }
}