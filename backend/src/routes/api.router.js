import assignment_router from './api.routes/assignment.router.js';
import assignment_extension_router from './api.routes/assignment-extension.router.js';
import task_router from './api.routes/task.router.js'
import task_extension_router from './api.routes/task-extension.router.js'
import scheduled_event_router from './api.routes/scheduled-event.router.js'
import exception_router from './api.routes/exception.router.js'
import { Router } from 'express';

const api_router = Router()

api_router.use('/assignments', assignment_router)
api_router.use('/tasks', task_router)
api_router.use('/assignment-extensions', assignment_extension_router)
api_router.use('/task-extensions', task_extension_router)
api_router.use('/scheduled-events', scheduled_event_router)
api_router.use('/exceptions', exception_router)

export default api_router