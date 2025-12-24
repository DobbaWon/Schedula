import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { Schedule } from '../../types/database';

export async function getAllSchedules(): Promise<Schedule[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      ScheduleID AS scheduleId,
      EmployeeID AS employeeId,
      Date       AS date,
      StartTime1 AS startTime1,
      EndTime1   AS endTime1,
      StartTime2 AS startTime2,
      EndTime2   AS endTime2,
      Type       AS type,
      LocationID AS locationId,
      Status     AS status
    FROM Schedules
  `);

  return result.recordset;
}

export async function getScheduleById(scheduleId: number): Promise<Schedule | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('scheduleId', sql.Int, scheduleId)
    .query(`
      SELECT
        ScheduleID AS scheduleId,
        EmployeeID AS employeeId,
        Date       AS date,
        StartTime1 AS startTime1,
        EndTime1   AS endTime1,
        StartTime2 AS startTime2,
        EndTime2   AS endTime2,
        Type       AS type,
        LocationID AS locationId,
        Status     AS status
      FROM Schedules
      WHERE ScheduleID = @scheduleId
    `);

  return result.recordset[0] ?? null;
}

export async function createSchedule(schedule: Omit<Schedule, 'scheduleId'>): Promise<Schedule> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('employeeId', sql.Int, schedule.employeeId)
    .input('date', sql.Date, schedule.date)
    .input('startTime1', sql.Time, schedule.startTime1)
    .input('endTime1', sql.Time, schedule.endTime1)
    .input('startTime2', sql.Time, schedule.startTime2 ?? null)
    .input('endTime2', sql.Time, schedule.endTime2 ?? null)
    .input('type', sql.NVarChar, schedule.type)
    .input('locationId', sql.Int, schedule.locationId ?? null)
    .input('status', sql.NVarChar, schedule.status)
    .query(`
      INSERT INTO Schedules (
        EmployeeID,
        Date,
        StartTime1,
        EndTime1,
        StartTime2,
        EndTime2,
        Type,
        LocationID,
        Status
      )
      OUTPUT INSERTED.ScheduleID AS scheduleId
      VALUES (
        @employeeId,
        @date,
        @startTime1,
        @endTime1,
        @startTime2,
        @endTime2,
        @type,
        @locationId,
        @status
      )
    `);

  return {
    scheduleId: result.recordset[0].scheduleId,
    ...schedule
  };
}

export async function updateSchedule(scheduleId: number, schedule: Partial<Omit<Schedule, 'scheduleId'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('scheduleId', sql.Int, scheduleId)
    .input('employeeId', sql.Int, schedule.employeeId ?? null)
    .input('date', sql.Date, schedule.date ?? null)
    .input('startTime1', sql.Time, schedule.startTime1 ?? null)
    .input('endTime1', sql.Time, schedule.endTime1 ?? null)
    .input('startTime2', sql.Time, schedule.startTime2 ?? null)
    .input('endTime2', sql.Time, schedule.endTime2 ?? null)
    .input('type', sql.NVarChar, schedule.type ?? null)
    .input('locationId', sql.Int, schedule.locationId ?? null)
    .input('status', sql.NVarChar, schedule.status ?? null)
    .query(`
      UPDATE Schedules
      SET
        EmployeeID = COALESCE(@employeeId, EmployeeID),
        Date       = COALESCE(@date, Date),
        StartTime1 = COALESCE(@startTime1, StartTime1),
        EndTime1   = COALESCE(@endTime1, EndTime1),
        StartTime2 = @startTime2,
        EndTime2   = @endTime2,
        Type       = COALESCE(@type, Type),
        LocationID = @locationId,
        Status     = COALESCE(@status, Status)
      WHERE ScheduleID = @scheduleId
    `);
}

export async function deleteSchedule(scheduleId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('scheduleId', sql.Int, scheduleId)
    .query(`
      DELETE FROM Schedules
      WHERE ScheduleID = @scheduleId
    `);
}
