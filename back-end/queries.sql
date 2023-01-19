-- SQL queries to be fed to anosql



-- name: now$
SELECT CURRENT_TIMESTAMP;

-- name: version$
SELECT VERSION();



-- name: get_auth_login^
SELECT password, isAdmin FROM Auth WHERE login = :login;

-- name: get_auth_data_login^
SELECT login, email, password, isAdmin FROM Auth WHERE login = :login;

-- name: check_auth_login
SELECT password, isAdmin FROM Auth WHERE login = :login FOR UPDATE;

-- name: get_auth_all
SELECT login, isAdmin FROM Auth ORDER BY 1;

-- name: get_auth_filter
SELECT login, isAdmin FROM Auth WHERE login LIKE :filter ORDER BY 1;

-- name: insert_auth!
INSERT INTO Auth(login, password, isAdmin, email) VALUES (:login, :password, :isAdmin, :email);

-- name: delete_auth!
DELETE FROM Auth WHERE login = :login;

-- name: upd_auth_password!
UPDATE Auth SET password = :password WHERE login = :login;

-- name: upd_auth_email!  
UPDATE Auth SET email = :email WHERE login = :login;

-- name: upd_auth_isAdmin!  
UPDATE Auth SET isAdmin = :isAdmin WHERE login = :login;




-- name: get_ann_all
SELECT title, description FROM Ann ORDER BY 1;


-- name: get_ann_filter
SELECT title, description FROM Ann WHERE title LIKE :filter ORDER BY 1;

-- name: insert_ann!
INSERT INTO Ann(title, starting_price, lid, description, expiration, current_price, ceiling_price)
VALUES (:title, :starting_price, :lid, :description, :expiration, :current_price, :ceiling_price);
