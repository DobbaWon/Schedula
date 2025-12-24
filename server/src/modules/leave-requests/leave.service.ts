import sql from 'mssql';
import { poolPromise } from '../../database/db';
import { LeaveRequest } from '../../types/database';

export async function getAllLeaves(): Promise<LeaveRequest[]> {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT
      LeaveID       AS leaveId,
      EmployeeID    AS employeeId,
      StartDate     AS startDate,
      EndDate       AS endDate,
      Status        AS status,
      Type          AS type,
      DoctorsNoteURL AS doctorsNoteUrl,
      SubmittedAt   AS submittedAt
    FROM Leave
  `);

  return result.recordset;
}

export async function getLeaveById(leaveId: number): Promise<LeaveRequest | null> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('leaveId', sql.Int, leaveId)
    .query(`
      SELECT
        LeaveID       AS leaveId,
        EmployeeID    AS employeeId,
        StartDate     AS startDate,
        EndDate       AS endDate,
        Status        AS status,
        Type          AS type,
        DoctorsNoteURL AS doctorsNoteUrl,
        SubmittedAt   AS submittedAt
      FROM Leave
      WHERE LeaveID = @leaveId
    `);

  return result.recordset[0] ?? null;
}

export async function createLeave(leave: Omit<LeaveRequest, 'leaveId' | 'submittedAt'>): Promise<LeaveRequest> {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('employeeId', sql.Int, leave.employeeId)
    .input('startDate', sql.Date, leave.startDate)
    .input('endDate', sql.Date, leave.endDate)
    .input('status', sql.NVarChar, leave.status)
    .input('type', sql.NVarChar, leave.type)
    .input('doctorsNoteUrl', sql.NVarChar, leave.doctorsNoteUrl ?? null)
    .query(`
      INSERT INTO Leave (
        EmployeeID,
        StartDate,
        EndDate,
        Status,
        Type,
        DoctorsNoteURL,
        SubmittedAt
      )
      OUTPUT INSERTED.LeaveID AS leaveId, INSERTED.SubmittedAt AS submittedAt
      VALUES (
        @employeeId,
        @startDate,
        @endDate,
        @status,
        @type,
        @doctorsNoteUrl,
        GETDATE()
      )
    `);

  return {
    leaveId: result.recordset[0].leaveId,
    submittedAt: result.recordset[0].submittedAt,
    ...leave
  };
}

export async function updateLeave(leaveId: number, leave: Partial<Omit<LeaveRequest, 'leaveId' | 'submittedAt'>>): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('leaveId', sql.Int, leaveId)
    .input('employeeId', sql.Int, leave.employeeId ?? null)
    .input('startDate', sql.Date, leave.startDate ?? null)
    .input('endDate', sql.Date, leave.endDate ?? null)
    .input('status', sql.NVarChar, leave.status ?? null)
    .input('type', sql.NVarChar, leave.type ?? null)
    .input('doctorsNoteUrl', sql.NVarChar, leave.doctorsNoteUrl ?? null)
    .query(`
      UPDATE Leave
      SET
        EmployeeID = COALESCE(@employeeId, EmployeeID),
        StartDate  = COALESCE(@startDate, StartDate),
        EndDate    = COALESCE(@endDate, EndDate),
        Status     = COALESCE(@status, Status),
        Type       = COALESCE(@type, Type),
        DoctorsNoteURL = @doctorsNoteUrl
      WHERE LeaveID = @leaveId
    `);
}

export async function deleteLeave(leaveId: number): Promise<void> {
  const pool = await poolPromise;

  await pool.request()
    .input('leaveId', sql.Int, leaveId)
    .query(`
      DELETE FROM Leave
      WHERE LeaveID = @leaveId
    `);
}
