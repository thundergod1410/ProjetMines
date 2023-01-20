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
SELECT title, description, publication, expiration, starting_price, current_price, ceiling_price  FROM Ann ORDER BY 1;

-- name: get_ann_filter
SELECT title, description, publication, expiration, starting_price, current_price, ceiling_price FROM Ann WHERE title LIKE :filter ORDER BY 1;

-- name: check_ann_aid
SELECT title FROM Ann WHERE aid = :aid FOR UPDATE;

-- name: insert_ann!
INSERT INTO Ann(title, starting_price, lid, description, expiration, current_price, ceiling_price)
VALUES (:title, :starting_price, :lid, :description, TO_DATE(:expiration, 'YYYY-MM-DD-HH24-MI'), :current_price, :ceiling_price);

-- name : delete_ann!
DELETE FROM Ann WHERE aid = :aid;

-- name: get_ann_aid^
SELECT * FROM Ann WHERE aid = :aid;

-- name: get_ann_login^
SELECT * FROM Ann JOIN Auth USING (lid) WHERE login = :login;

-- name: get_ann_filter_new
SELECT * FROM Ann
WHERE title LIKE :title_filter AND description LIKE :description_filter AND current_price <= :price_max AND over = :over;
