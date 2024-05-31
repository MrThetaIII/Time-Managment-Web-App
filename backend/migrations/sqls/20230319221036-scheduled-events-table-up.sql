CREATE TABLE scheduled_events
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    repeat_every INTEGER NOT NULL,
    start_at TIME NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#F2ED6F',
    duration INTEGER NOT NULL
);

INSERT INTO scheduled_events
    (name, description, start_date, end_date, repeat_every, start_at, duration)
VALUES
    (
        'Task 1',
        'Description 1',
        '2023-03-19',
        '2023-03-25',
        3,
        '07:00:00',
        60
),
    (
        'Task 2',
        'Description 2',
        '2023-03-18',
        '2023-04-29',
        3,
        '14:00:00',
        150
),
    (
        'Task 3',
        'Description 3',
        '2023-03-17',
        '2023-03-25',
        4,
        '09:00:00',
        120
),
    (
        'Task 4',
        'Description 4',
        '2023-03-15',
        '2023-06-28',
        1,
        '20:00:00',
        120
);