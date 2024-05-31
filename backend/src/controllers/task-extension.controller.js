// [ ] Task Extension Controller

// import { TaskStore } from "../database/models/task.model";

// const store = new TaskStore()

import { TaskExtensionStore } from "../database/models/task-extension.model.js";

const store = new TaskExtensionStore()

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
        const { task_id, time, duration } = _req.body;
        await store.insert({ task_id, time, duration });
        res.status(201).send('Task created');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const update = async (_req, res) => {
    try {
        const { id, task_id, time, duration, color, completed } = _req.body;
        await store.update({ id, task_id, time, duration, color, completed });
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