// [ ] Task Extension Router

import { Router } from 'express';
import * as task_extension_controller from '../../controllers/task-extension.controller.js';

const task_extension_router = Router();

task_extension_router.post('/get-for-week', task_extension_controller.index);
task_extension_router.post('/create', task_extension_controller.create);
task_extension_router.put('/update', task_extension_controller.update);
task_extension_router.put('/delete', task_extension_controller.remove);

export default task_extension_router;