CREATE TABLE exceptions
(
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    date date NOT NULL,
    FOREIGN KEY (task_id) REFERENCES scheduled_events(id)
);

INSERT INTO exceptions
    (task_id, date)
VALUES
    (4, '2023-03-21'),
    (4, '2023-03-23');
