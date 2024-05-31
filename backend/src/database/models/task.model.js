// [ ] Task model

// id SERIAL PRIMARY KEY
// name VARCHAR(255)
// description VARCHAR(255)
// time TIMESTAMP
// duration INTEGER

import client from '../database.client.js';
import { startPoint, withinTheWeek, timeFromDate } from "../../utility/time_manipulation.js";

export class TaskStore {
    async index(starting_hour, current_date) {
        try {
            const sql = 'SELECT * FROM tasks';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return mutate_tasks(result.rows, current_date, starting_hour);
        } catch (err) {
            throw new Error(`Could not get tasks. Error: ${err}`);
        }
    }

    async insert({ name, description, time, duration }) {
        try {
            const sql = 'INSERT INTO tasks (name, description, time, duration) VALUES ($1, $2, $3, $4)';
            const conn = await client.connect();
            await conn.query(sql, [name, description, time, duration]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not add new task ${name}. Error: ${err}`);
        }
    }

    async update({ id, name, description, time, duration, color, completed }) {
        try {
            const sql = 'UPDATE tasks SET name=$1, description=$2, time=$3, duration=$4, color=$5, completed=$6 WHERE id=$7';
            const conn = await client.connect();
            await conn.query(sql, [name, description, time, duration, color, completed, id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not update task ${name}. Error: ${err}`);
        }
    }

    async delete(id) {
        try {
            const sql_pre = 'DELETE FROM task_extensions WHERE task_id=($1)';
            const sql = 'DELETE FROM tasks WHERE id=($1)';
            const conn = await client.connect();
            await conn.query(sql_pre, [id]);
            await conn.query(sql, [id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete task ${id}. Error: ${err}`);
        }
    }

    async last_extension(id) {
        try {
            const sql = 'select * from task_extensions where time = (select max(time) from task_extensions where task_id = $1)';
            const conn = await client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (err) {
            throw new Error(`Could not get the last extension. Error: ${err}`);
        }
    }
}

const mutate_tasks = (tasks, current_date, starting_hour) => {
    return tasks.map(elem => (
        {
            ...elem,
            start: startPoint(elem.time, starting_hour),
            day: withinTheWeek(current_date, elem.time),
            start_at: timeFromDate(elem.time)
        }
    )).filter(
        elem => elem.day >= 0 && elem.day <= 6
    )
}

