// [ ] task extension model

// Data Fields
// id SERIAL PRIMARY KEY
// task_id INTEGER
// time TIMESTAMP
// duration INTEGER

import client from '../database.client.js';
import { startPoint, withinTheWeek, timeFromDate } from "../../utility/time_manipulation.js";

export class TaskExtensionStore {
    async index(starting_hour, current_date) {
        try {
            const sql = 'SELECT task_extensions.id, task_extensions.task_id, task_extensions.time, task_extensions.duration, task_extensions.color, tasks.name as task_name, tasks.time as original_time, tasks.completed as completed, tasks.description as task_description FROM task_extensions INNER JOIN tasks ON task_extensions.task_id = tasks.id';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return mutate_tasks_extensions(result.rows, current_date, starting_hour);
        } catch (err) {
            throw new Error(`Could not get tasks' extensions. Error: ${err}`);
        }
    }

    async insert({ task_id, time, duration }) {
        try {
            const sql = 'INSERT INTO task_extensions (task_id, time, duration) VALUES($1, $2, $3)';
            const conn = await client.connect();
            await conn.query(sql, [task_id, time, duration]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not add new task extension. Error: ${err}`);
        }
    }


    async update({ id, task_id, time, duration, color, completed }) {
        try {
            const sql = 'UPDATE task_extensions SET time=$1, duration=$2, color=$3 WHERE id=$4';
            const sql_2 = 'UPDATE tasks SET completed=$1 WHERE id=$2';
            const conn = await client.connect();
            await conn.query(sql, [time, duration, color, id]);
            await conn.query(sql_2, [completed, task_id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not update task extension ${id}. Error: ${err}`);
        }
    }

    async delete(id) {
        try {
            const sql = 'DELETE FROM task_extensions WHERE id=($1)';
            const conn = await client.connect();
            await conn.query(sql, [id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete task extension ${id}. Error: ${err}`);
        }
    }
}

const mutate_tasks_extensions = (tasks, current_date, starting_hour) => {
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

