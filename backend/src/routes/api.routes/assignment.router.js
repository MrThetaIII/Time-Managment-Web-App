// [ ] Extension Router

import { Router } from 'express';
import * as assignment_controller from '../../controllers/assignment.controller.js';

const assignment_router = Router();

assignment_router.post('/get-for-week', assignment_controller.index);
assignment_router.post('/create', assignment_controller.create);
assignment_router.put('/update', assignment_controller.update);
assignment_router.put('/delete', assignment_controller.remove);
assignment_router.post('/last-extension', assignment_controller.last_extension);

export default assignment_router;