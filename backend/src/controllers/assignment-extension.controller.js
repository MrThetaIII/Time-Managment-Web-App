// [ ] Assignment Extension Controller

import { AssignmentExtensionStore } from "../database/models/assignment-extension.model.js";

const store = new AssignmentExtensionStore()

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
        const { assignment_id, time, duration } = _req.body;
        await store.insert({ assignment_id, time, duration });
        res.status(201).send('Assignment Extension created');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const update = async (_req, res) => {
    try {
        const { id, assignment_id, time, duration, color, completed } = _req.body;
        await store.update({ id, assignment_id, time, duration, color, completed });
        res.status(201).send('Assignment Extension updated');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const remove = async (_req, res) => {
    try {
        const { id } = _req.body;
        await store.delete(id);
        res.status(201).send('Assignment Extension deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}