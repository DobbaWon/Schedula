import { Router } from 'express';
import * as controller from './leave.controller';

const router = Router();

router.get('/', controller.getLeaves);
router.get('/:id', controller.getLeave);
router.post('/', controller.createLeave);
router.put('/:id', controller.updateLeave);
router.delete('/:id', controller.deleteLeave);

export default router;
