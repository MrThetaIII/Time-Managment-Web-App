// [ ] Exception Controller

import { ExceptionStore } from "../database/models/exception.model.js";

const store = new ExceptionStore()

export const index = async (_req, res) => {
    try {
        const results = await store.index();
        res.json(results);
    } catch (err) {
        res.status(400).json(err);
    }
}

export const create = async (_req, res) => {
    try {
        const { task_id, date } = _req.body;
        await store.create({ task_id, date });
        res.status(201).send('Exception created');
    } catch (err) {
        res.status(400).json(err);
    }
}

export const remove = async (_req, res) => {
    try {
        const { id } = _req.body;
        await store.delete(id);
        res.status(201).send('Exception deleted');
    } catch (err) {
        res.status(400).json(err);
    }
}