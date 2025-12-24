import { Request, Response } from 'express';
import * as scheduleService from './schedules.service';

export async function getSchedules(_req: Request, res: Response) {
  const schedules = await scheduleService.getAllSchedules();
  res.json(schedules);
}

export async function getSchedule(req: Request, res: Response) {
  const scheduleId = Number(req.params.id);
  const schedule = await scheduleService.getScheduleById(scheduleId);

  if (!schedule) {
    res.status(404).json({ message: 'Schedule not found' });
    return;
  }

  res.json(schedule);
}

export async function createSchedule(req: Request, res: Response) {
  const schedule = await scheduleService.createSchedule(req.body);
  res.status(201).json(schedule);
}

export async function updateSchedule(req: Request, res: Response) {
  const scheduleId = Number(req.params.id);
  await scheduleService.updateSchedule(scheduleId, req.body);
  res.status(204).send();
}

export async function deleteSchedule(req: Request, res: Response) {
  const scheduleId = Number(req.params.id);
  await scheduleService.deleteSchedule(scheduleId);
  res.status(204).send();
}
