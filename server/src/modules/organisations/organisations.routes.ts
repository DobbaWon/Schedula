import { Router } from 'express';
import * as controller from './organisations.controller';

const router = Router();

router.get('/', controller.getOrganisations);
router.get('/:id', controller.getOrganisation);
router.post('/', controller.createOrganisation);
router.put('/:id', controller.updateOrganisation);
router.delete('/:id', controller.deleteOrganisation);

export default router;
