import { Router } from 'express';
import * as controller from './notifications.controller';

const router = Router();

router.get('/', controller.getNotifications);
router.get('/:id', controller.getNotification);
router.post('/', controller.createNotification);
router.put('/:id', controller.updateNotification);
router.delete('/:id', controller.deleteNotification);

export default router;
