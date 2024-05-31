// [ ] Assignment Extension Router

import { Router } from 'express';
import * as assignment_extension_controller from '../../controllers/assignment-extension.controller.js';

const assignment_extension_router = Router();

assignment_extension_router.post('/get-for-week', assignment_extension_controller.index);
assignment_extension_router.post('/create', assignment_extension_controller.create);
assignment_extension_router.put('/update', assignment_extension_controller.update);
assignment_extension_router.put('/delete', assignment_extension_controller.remove);

export default assignment_extension_router;