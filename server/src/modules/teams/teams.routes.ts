import { Router } from 'express';
import * as controller from './teams.controller';

const router = Router();

router.get('/', controller.getTeams);
router.get('/:id', controller.getTeam);
router.post('/', controller.createTeam);
router.put('/:id', controller.updateTeam);
router.delete('/:id', controller.deleteTeam);

export default router;
