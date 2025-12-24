import { Request, Response } from 'express';
import * as leaveService from './leave.service';

export async function getLeaves(_req: Request, res: Response) {
  const leaves = await leaveService.getAllLeaves();
  res.json(leaves);
}

export async function getLeave(req: Request, res: Response) {
  const leaveId = Number(req.params.id);
  const leave = await leaveService.getLeaveById(leaveId);

  if (!leave) {
    res.status(404).json({ message: 'Leave request not found' });
    return;
  }

  res.json(leave);
}

export async function createLeave(req: Request, res: Response) {
  const leave = await leaveService.createLeave(req.body);
  res.status(201).json(leave);
}

export async function updateLeave(req: Request, res: Response) {
  const leaveId = Number(req.params.id);
  await leaveService.updateLeave(leaveId, req.body);
  res.status(204).send();
}

export async function deleteLeave(req: Request, res: Response) {
  const leaveId = Number(req.params.id);
  await leaveService.deleteLeave(leaveId);
  res.status(204).send();
}
