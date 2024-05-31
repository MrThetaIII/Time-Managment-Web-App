CREATE TABLE assignments
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    deadline TIMESTAMP NOT NULL,
    task_id INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    color VARCHAR(7) NOT NULL DEFAULT '#CC7178',
    FOREIGN KEY (task_id) REFERENCES scheduled_events (id) ON DELETE CASCADE
);

INSERT INTO assignments
    (name, description, time, duration, deadline, task_id)
VALUES
    ('Task 1', 'Description 1', '2023-03-19 10:22:00', 60, '2023-03-25 16:22:00', 1),
    ('Task 2', 'Description 2', '2023-03-19 10:22:00', 120, '2023-04-19 09:22:00', 1),
    ('Task 3', 'Description 3', '2023-03-20 15:00:00', 60, '2023-03-20 23:00:00', 1),
    ('Task 4', 'Description 4', '2023-03-20 08:22:00', 60, '2023-03-25 11:22:00', 1),
    ('Task 5', 'Description 5', '2023-03-22 14:22:00', 120, '2023-04-01 16:22:00', 1),
    ('Task 6', 'Description 6', '2023-03-23 10:22:00', 60, '2023-04-01 08:22:00', 1),
    ('Task 7', 'Description 7', '2023-03-24 07:22:00', 80, '2023-03-29 13:42:00', 1),
    ('Task 8', 'Description 8', '2023-03-25 09:22:00', 90, '2023-04-01 11:52:00', 1);
