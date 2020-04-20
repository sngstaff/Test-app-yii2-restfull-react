# Тестовое приложение с использованием Yii2 Rest + react front
<h3>Шаг 1</h3>
<p>Использование php console</p>
<ul>
<li>init</li>
<li>yii migrate - <b>При миграции создаются 3 пользователя (admin, employee, client)</b></li>
<li>yii migrate --migrationPath=@yii/rbac/migrations</li>
<li>yii rbac/init</li>
<li>yii roles/assign - <b>Назначить роль пользователю [username]</b></li>
<li>yii roles/revoke - <b>Снять роль с пользователя</b></li>
</ul>
<h3>Шаг 2</h3>
<p>Переходим в папку "react" - использование npm</p>
<ul>
<li>npm init </li>
</ul>