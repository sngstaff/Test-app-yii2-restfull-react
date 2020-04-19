<?php

namespace api\models;


use Yii;
use yii\base\Model;
use common\models\User;

/**
 * Login form
 */
class LoginForm extends Model
{
    public $username;
    public $password;
    public $rememberMe = true;

    private $_user;


    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            // username and password are both required
            [['username', 'password'], 'required'],
            // rememberMe must be a boolean value
            ['rememberMe', 'boolean'],
            // password is validated by validatePassword()
            ['password', 'validatePassword'],
        ];
    }

    /**
     * Validates the password.
     * This method serves as the inline validation for password.
     *
     * @param string $attribute the attribute currently being validated
     * @param array $params the additional name-value pairs given in the rule
     */
    public function validatePassword($attribute, $params)
    {
        if (!$this->hasErrors()) {
            $user = $this->getUser();
            if (!$user || !$user->validatePassword($this->password)) {
                $this->addError($attribute, 'Неверный логин или пароль.');
            }
        }
    }

    /**
//     * @return User|null
     */
    public function login()
    {
        if ($this->validate()) {
            $user = $this->getUser();
            $user->verification_token = Yii::$app->security->generateRandomString() . '_' . time();
            return $user->save() ? [
                'user' => [
                    'id' => $user->id,
                    'login' => $user->username,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'roles' => $user->roles,
                    'position' => $user->position,
                    'passport' => $user->passport_series
                ],
                'token' => $user->verification_token
            ] : null;
        }
        
        return null;
    }

    /**
     * Finds user by [[username]]
     *
     * @return User|null
     */
    protected function getUser()
    {
        if ($this->_user === null) {
            $this->_user = User::findByUsername($this->username);
        }

        return $this->_user;
    }
}
