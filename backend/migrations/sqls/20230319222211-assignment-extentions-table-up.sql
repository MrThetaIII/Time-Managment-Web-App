create TABLE assignment_extensions
(
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL,
    time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#BA5A31',
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
);

INSERT INTO assignment_extensions
    (assignment_id, time, duration)
VALUES
    (1, '2023-03-22 16:22:00', 120),
    (3, '2023-03-25 22:00:00', 60);


