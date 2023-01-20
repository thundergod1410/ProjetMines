--
-- import from local external file:
--
\copy Auth(login, password, isAdmin) from './test_users.csv' (format csv);

INSERT INTO Ann(title, description, expiration, starting_price, current_price, ceiling_price, lid) VALUES ('Montre', 'Rolex, comme neuve', to_date('2023-05-01-12-30', 'YYYY-MM-DD-HH24-MI'), 100.0, 100.0, 2000.0, 1);

