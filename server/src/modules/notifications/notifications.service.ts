import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Notification } from '../../types/database';

export async function getAllNotifications(): Promise<Notification[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      NotificationID AS notificationId,
      EmployeeID     AS employeeId,
      Type           AS type,
      Message        AS message,
      Read           AS read,
      CreatedAt      AS createdAt
    FROM Notifications
  `);

  return result.recordset;
}

export async function getNotificationById(notificationId: number): Promise<Notification | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('notificationId', sql.Int, notificationId)
    .query(`
      SELECT
        NotificationID AS notificationId,
        EmployeeID     AS employeeId,
        Type           AS type,
        Message        AS message,
        Read           AS read,
        CreatedAt      AS createdAt
      FROM Notifications
      WHERE NotificationID = @notificationId
    `);

  return result.recordset[0] ?? null;
}

export async function createNotification(notification: Omit<Notification, 'notificationId' | 'createdAt'>): Promise<Notification> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('employeeId', sql.Int, notification.employeeId)
    .input('type', sql.NVarChar, notification.type)
    .input('message', sql.NVarChar, notification.message)
    .input('read', sql.Bit, notification.read ?? false)
    .query(`
      INSERT INTO Notifications (
        EmployeeID,
        Type,
        Message,
        Read
      )
      OUTPUT INSERTED.NotificationID AS notificationId, INSERTED.CreatedAt AS createdAt
      VALUES (
        @employeeId,
        @type,
        @message,
        @read
      )
    `);

  return {
    notificationId: result.recordset[0].notificationId,
    createdAt: result.recordset[0].createdAt,
    ...notification
  };
}

export async function updateNotification(notificationId: number, notification: Partial<Omit<Notification, 'notificationId' | 'createdAt'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('notificationId', sql.Int, notificationId)
    .input('employeeId', sql.Int, notification.employeeId ?? null)
    .input('type', sql.NVarChar, notification.type ?? null)
    .input('message', sql.NVarChar, notification.message ?? null)
    .input('read', sql.Bit, notification.read ?? null)
    .query(`
      UPDATE Notifications
      SET
        EmployeeID = COALESCE(@employeeId, EmployeeID),
        Type       = COALESCE(@type, Type),
        Message    = COALESCE(@message, Message),
        Read       = COALESCE(@read, Read)
      WHERE NotificationID = @notificationId
    `);
}

export async function deleteNotification(notificationId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('notificationId', sql.Int, notificationId)
    .query(`
      DELETE FROM Notifications
      WHERE NotificationID = @notificationId
    `);
}
