// [ ] Exception Router

import { Router } from 'express';
import * as exception_controller from '../../controllers/exception.controller.js';

const exception_router = Router();

exception_router.post('/get-for-week', exception_controller.index);
exception_router.post('/create', exception_controller.create);
exception_router.put('/delete', exception_controller.remove);

export default exception_router;