// [ ] Task Router

import { TaskStore } from "../database/models/task.model.js";

const store = new TaskStore()

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
        const { name, description, time, duration } = _req.body;
        await store.insert({ name, description, time, duration });
        res.status(201).send('Task created');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const update = async (_req, res) => {
    try {
        const { id, name, description, time, duration, color, completed } = _req.body;
        await store.update({ id, name, description, time, duration, color, completed });
        res.status(201).send('Task updated');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const remove = async (_req, res) => {
    try {
        const { id } = _req.body;
        await store.delete(id);
        res.status(201).send('Task deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const last_extension = async (_req, res) => {
    try {
        const { id } = _req.body;
        const result = await store.last_extension(id);
        res.json(result);
    } catch (err) {
        res.status(400).json(err);
    }
}