CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TIMESTAMP NOT NULL,
    is_active BOOL NOT NULL DEFAULT false
);

INSERT INTO users (first_name, last_name, date_of_birth) values
('David', 'Bowie', '1947-01-08'),
('Bob', 'Dylan', '1941-05-24'),
('Mick', 'Jagger', '1943-07-26'),
('Bob', 'Marley', '1945-02-06'),
('Bob', 'McFerrin', '1950-03-11');

UPDATE users SET is_active = 'true' WHERE first_name = 'Bob';

SELECT * 
FROM users 
WHERE is_active=true;