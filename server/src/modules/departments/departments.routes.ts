import { Router } from 'express';
import * as controller from './departments.controller';

const router = Router();

router.get('/', controller.getDepartments);
router.get('/:id', controller.getDepartment);
router.post('/', controller.createDepartment);
router.put('/:id', controller.updateDepartment);
router.delete('/:id', controller.deleteDepartment);

export default router;
