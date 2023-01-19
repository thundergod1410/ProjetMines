--
-- import from local external file:
--
\copy Auth(login, password, isAdmin) from './test_users.csv' (format csv);

INSERT INTO Ann(title, starting_price, lid) VALUES ('Montre', 100.0, 1);

