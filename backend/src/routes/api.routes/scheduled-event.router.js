// [ ] Scheduled Event Router

import { Router } from 'express';
import * as scheduled_event_controller from '../../controllers/scheduled-event.controller.js';

const scheduled_event_router = Router();

scheduled_event_router.post('/get-for-week', scheduled_event_controller.index);
scheduled_event_router.post('/create', scheduled_event_controller.create);
scheduled_event_router.put('/update', scheduled_event_controller.update);
scheduled_event_router.put('/delete', scheduled_event_controller.remove);

export default scheduled_event_router;