CREATE TABLE tasks
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#AFC1D6',
    completed BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO tasks
    (name, description, time, duration)
VALUES
    ('Task 1', 'Description 1', '2023-03-19 15:22:00', 60),
    ('Task 2', 'Description 2', '2023-03-19 07:22:00', 120),
    ('Task 3', 'Description 3', '2023-03-20 22:00:00', 60),
    ('Task 4', 'Description 4', '2023-03-20 10:22:00', 60),
    ('Task 5', 'Description 5', '2023-03-21 14:22:00', 120),
    ('Task 6', 'Description 6', '2023-03-23 07:22:00', 60),
    ('Task 7', 'Description 7', '2023-03-24 12:22:00', 80),
    ('Task 8', 'Description 8', '2023-03-24 09:22:00', 90);