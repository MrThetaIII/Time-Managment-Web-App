CREATE TABLE task_extensions
(
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#9D44B5',
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);

INSERT INTO task_extensions
    (task_id, time, duration)
VALUES
    (1, '2023-03-21 09:22:00', 120),
    (3, '2023-03-21 22:00:00', 60);
