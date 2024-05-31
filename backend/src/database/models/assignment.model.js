// [ ] Assignment Model

// Data Fields
// id SERIAL PRIMARY KEY
// name VARCHAR(255)
// description VARCHAR(255)
// time TIMESTAMP
// duration INTEGER
// deadline TIMESTAMP
// task_id INTEGER

import client from '../database.client.js';
import { startPoint, withinTheWeek, timeFromDate } from "../../utility/time_manipulation.js";

export class AssignmentStore {
    async index(starting_hour, current_date) {
        try {
            const sql = 'SELECT assignments.id, assignments.name, assignments.description, assignments.time, assignments.duration, assignments.deadline, assignments.task_id, assignments.color, assignments.completed, scheduled_events.name AS event_name FROM assignments INNER JOIN scheduled_events ON assignments.task_id = scheduled_events.id';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return mutate_assignments(result.rows, current_date, starting_hour);
        } catch (err) {
            throw new Error(`Could not get assignments. Error: ${err}`);
        }
    }

    async insert({ name, description, time, duration, deadline, task_id }) {
        try {
            const sql = 'INSERT INTO assignments (name, description, time, duration, deadline, task_id) VALUES ($1, $2, $3, $4, $5, $6)';
            const conn = await client.connect();
            await conn.query(sql, [name, description, time, duration, deadline, task_id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not add new assignment. Error: ${err}`);
        }
    }

    async update({ id, name, description, time, duration, deadline, color, completed }) {
        try {
            const sql = 'UPDATE assignments SET name=$1, description=$2, time=$3, duration=$4, deadline=$5, color=$6, completed=$7 WHERE id=$8';
            const conn = await client.connect();
            await conn.query(sql, [name, description, time, duration, deadline, color, completed, id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not update assignment ${id}. Error: ${err}`);
        }
    }

    async delete(id) {
        try {
            const sql_pre = 'DELETE FROM assignment_extensions WHERE assignment_id=($1)';
            const sql = 'DELETE FROM assignments WHERE id=($1)';
            const conn = await client.connect();
            await conn.query(sql_pre, [id]);
            await conn.query(sql, [id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete assignment ${id}. Error: ${err}`);
        }
    }

    async last_extension(id) {
        try {
            const sql = 'select * from assignment_extensions where time = (select max(time) from assignment_extensions where assignment_id = $1)';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            throw new Error(`Could not get the last extension. Error: ${err}`);
        }
    }
}

const mutate_assignments = (assignments, current_date, starting_hour) => {
    return assignments.map(elem => (
        {
            ...elem,
            start: startPoint(elem.time, starting_hour),
            day: withinTheWeek(current_date, elem.time),
            start_at: timeFromDate(elem.time)
        }
    ))
        .filter(
            elem => elem.day >= 0 && elem.day <= 6
        )
}

