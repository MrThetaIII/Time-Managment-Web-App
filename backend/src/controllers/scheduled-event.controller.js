// [ ] Scheduled Event Controller

import { ScheduledEventStore } from "../database/models/scheduled-event.model.js";

const store = new ScheduledEventStore()

export const index = async (_req, res) => {
    try {
        const { starting_hour, current_date } = _req.body;
        const results = await store.index(starting_hour, current_date);
        res.json(results);
    } catch (err) {
        res.status(400).json(err);
    }
}

export const create = async (_req, res) => {
    try {
        const { name, description, start_date, end_date, repeat_every, start_at, duration } = _req.body;
        await store.insert({ name, description, start_date, end_date, repeat_every, start_at, duration });
        res.status(201).send('Scheduled Event created');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const update = async (_req, res) => {
    try {
        const { id, name, description, start_date, end_date, repeat_every, start_at, duration, color } = _req.body;
        await store.update({ id, name, description, start_date, end_date, repeat_every, start_at, duration, color });
        res.status(201).send('Scheduled Event updated');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const remove = async (_req, res) => {
    try {
        const { id } = _req.body;
        await store.delete(id);
        res.status(201).send('Scheduled Event deleted');
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}