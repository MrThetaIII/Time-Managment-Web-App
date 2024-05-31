// [ ] Scheduled Event Model

// Data Fields
// id SERIAL PRIMARY KEY,
// name VARCHAR(255)
// description VARCHAR(255)
// start_date TIMESTAMP
// end_date TIMESTAMP
// repeat_every INTEGER
// start_at TIME
// duration INTEGER

import client from '../database.client.js';
import { getDaysListFromSchedule, startPoint, withinTheWeek, current_event_date } from "../../utility/time_manipulation.js";

export class ScheduledEventStore {
    async index(starting_hour, current_date) {
        try {
            const sql = 'SELECT * FROM scheduled_events';
            const conn = await client.connect();
            const result = await conn.query(sql);
            const tasks = mutate_events(result.rows, current_date, starting_hour)
            const exception_sql = 'SELECT * FROM exceptions';
            const exceptions = (await conn.query(exception_sql)).rows;
            conn.release();
            return get_valid(tasks, exceptions, current_date);
        } catch (err) {
            throw new Error(`Could not get scheduled events' extensions. Error: ${err}`);
        }
    }

    async update({ id, name, description, start_date, end_date, repeat_every, start_at, duration, color }) {
        try {
            const sql = 'UPDATE scheduled_events SET name=$1, description=$2, start_date=$3, end_date=$4, repeat_every=$5, start_at=$6, duration=$7, color=$8 WHERE id=$9';
            const conn = await client.connect();
            await conn.query(sql, [name, description, start_date, end_date, repeat_every, start_at, duration, color, id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not update scheduled event ${id}. Error: ${err}`);
        }
    }

    async insert({ name, description, start_date, end_date, repeat_every, start_at, duration }) {
        try {
            const sql = 'INSERT INTO scheduled_events (name, description, start_date, end_date, repeat_every, start_at, duration) VALUES($1, $2, $3, $4, $5, $6, $7)';
            const conn = await client.connect();
            await conn.query(sql, [name, description, start_date, end_date, repeat_every, start_at, duration]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not add new scheduled event ${name}. Error: ${err}`);
        }
    }

    async delete(id) {
        try {
            const sql_pre = 'DELETE FROM exceptions WHERE task_id=($1)';
            const sql_pre_ = 'Delete FROM assignments WHERE task_id=($1)'
            const sql = 'DELETE FROM scheduled_events WHERE id=($1)';
            const conn = await client.connect();
            await conn.query(sql_pre_, [id]);
            await conn.query(sql_pre, [id]);
            await conn.query(sql, [id]);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete scheduled event ${id}. Error: ${err}`);
        }
    }
}

const mutate_events = (scheduled_events, current_date, starting_hour) => {
    const k = Array.from(scheduled_events).map(elem => (
        {
            ...elem,
            start: startPoint(`10-20-1990 ${elem.start_at}`, starting_hour),
        }
    ))
    const scheduled = []
    let instance_id = 0
    k.forEach(elem => {
        const days_list = getDaysListFromSchedule(current_date, elem.start_date, elem.end_date, elem.repeat_every)
        days_list.forEach(day => {
            scheduled.push({ ...elem, day: day, current_date: current_event_date(day, current_date), instance_id: instance_id++ })
        })
    })
    return scheduled
}

const get_valid = (tasks, exceptions, current_date) => {
    return tasks.filter(task => {
        const hasExceptions = exceptions.filter(
            exception => exception.task_id === task.id && withinTheWeek(current_date, exception.date) === task.day
        )
        return hasExceptions.length === 0
    })
}