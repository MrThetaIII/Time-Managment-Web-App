// [ ] Task Controller

import { Router } from 'express';
import * as task_controller from '../../controllers/task.controller.js';

const task_router = Router();

task_router.post('/get-for-week', task_controller.index);
task_router.post('/create-task', task_controller.create);
task_router.put('/update-task', task_controller.update);
task_router.put('/delete-task', task_controller.remove);
task_router.post('/last-extension', task_controller.last_extension);

export default task_router;