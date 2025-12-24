import { Router } from 'express';
import * as controller from './provider.controller';

const router = Router();

router.get('/', controller.getAuthProviders);
router.get('/:employeeId/:provider', controller.getAuthProvider);
router.post('/', controller.createAuthProvider);
router.put('/:employeeId/:provider', controller.updateAuthProvider);
router.delete('/:employeeId/:provider', controller.deleteAuthProvider);

export default router;
