-- SQL queries to be fed to anosql

-- name: now$
SELECT CURRENT_TIMESTAMP;

-- name: version$
SELECT VERSION();

-- name: get_auth_login^
SELECT password, isAdmin
FROM Auth
WHERE login = :login;

-- name: get_auth_login_lock^
SELECT password, isAdmin
FROM Auth
WHERE login = :login
FOR UPDATE;

-- name: insert_auth!
INSERT INTO Auth(login, password, isAdmin)
VALUES (:login, :password, :is_admin);

-- name: delete_user!
DELETE FROM Auth WHERE login = :login;
