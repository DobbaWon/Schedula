import { Request, Response } from 'express';
import * as notificationService from './notifications.service';

export async function getNotifications(_req: Request, res: Response) {
  const notifications = await notificationService.getAllNotifications();
  res.json(notifications);
}

export async function getNotification(req: Request, res: Response) {
  const notificationId = Number(req.params.id);
  const notification = await notificationService.getNotificationById(notificationId);

  if (!notification) {
    res.status(404).json({ message: 'Notification not found' });
    return;
  }

  res.json(notification);
}

export async function createNotification(req: Request, res: Response) {
  const notification = await notificationService.createNotification(req.body);
  res.status(201).json(notification);
}

export async function updateNotification(req: Request, res: Response) {
  const notificationId = Number(req.params.id);
  await notificationService.updateNotification(notificationId, req.body);
  res.status(204).send();
}

export async function deleteNotification(req: Request, res: Response) {
  const notificationId = Number(req.params.id);
  await notificationService.deleteNotification(notificationId);
  res.status(204).send();
}
