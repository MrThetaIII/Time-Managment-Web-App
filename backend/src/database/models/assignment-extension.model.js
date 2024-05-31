// [ ] Assignment extension model

// Data Fields
// id SERIAL PRIMARY KEY
// assignment_id INTEGER
// time TIMESTAMP
// duration INTEGER

import client from '../database.client.js';
import { startPoint, withinTheWeek, timeFromDate } from "../../utility/time_manipulation.js";

export class AssignmentExtensionStore {
    async index(starting_hour, current_date) {
        try {
            const sql = 'SELECT assignment_extensions.id, assignment_extensions.assignment_id, assignment_extensions.time, assignment_extensions.duration, assignment_extensions.color, assignments.name as assignment_name, assignments.time as original_time, assignments.completed as completed, assignments.description as assignment_description FROM assignment_extensions INNER JOIN assignments ON assignment_extensions.assignment_id = assignments.id';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return mutate_assignments_extensions(result.rows, current_date, starting_hour);
        } catch (err) {
            throw new Error(`Could not get assignments' extensions. Error: ${err}`);
        }
    }

    async insert({ assignment_id, time, duration }) {
        try {
            const sql = 'INSERT INTO assignment_extensions (assignment_id, time, duration) VALUES($1, $2, $3)';
            const conn = await client.connect();
            await conn.query(sql, [assignment_id, time, duration]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not add new assignment extension. Error: ${err}`);
        }
    }

    async update({ id, assignment_id, time, duration, color, completed }) {
        try {
            const sql = 'UPDATE assignment_extensions SET time=$1, duration=$2, color=$3 WHERE id=$4';
            const sql_2 = 'UPDATE assignments SET completed=$1 WHERE id=$2';
            const conn = await client.connect();
            await conn.query(sql, [time, duration, color, id]);
            await conn.query(sql_2, [completed, assignment_id]);
            conn.release();
        } catch (err) {
            console.log(err);
            throw new Error(`Could not update assignment extension ${id}. Error: ${err}`);
        }
    }

    async delete(id) {
        try {
            const sql = 'DELETE FROM assignment_extensions WHERE id=($1)';
            const conn = await client.connect();
            await conn.query(sql, [id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete assignment extension ${id}. Error: ${err}`);
        }
    }
}


const mutate_assignments_extensions = (tasks, current_date, starting_hour) => {
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