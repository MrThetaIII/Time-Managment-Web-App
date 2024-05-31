// [ ] Exception Model

// Data Fields
// id SERIAL PRIMARY KEY
// task_id INTEGER
// date date

import client from '../database.client.js';
// import { getDaysListFromSchedule, startPoint, withinTheWeek } from "../../utility/time_manipulation";

export class ExceptionStore {
    async index() {
        try {
            const sql = 'SELECT exceptions.id, exceptions.task_id, exceptions.date, scheduled_events.name AS event_name FROM exceptions INNER JOIN scheduled_events ON exceptions.task_id = scheduled_events.id';
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get exceptions. Error: ${err}`);
        }
    }


    async create({ task_id, date }) {
        try {
            const sql = 'INSERT INTO exceptions (task_id, date) VALUES ($1, $2)';
            const conn = await client.connect();
            await conn.query(sql, [task_id, date]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not create exception. Error: ${err}`);
        }
    }

    async delete(id) {
        try {
            const sql = 'DELETE FROM exceptions WHERE id=($1)';
            const conn = await client.connect();
            await conn.query(sql, [id]);
            conn.release();
        } catch {
            throw new Error(`Could not delete exception ${id}. Error: ${err}`);
        }
    }

}