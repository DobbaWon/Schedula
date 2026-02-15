import { WorkArrangement, WorkTimeControlPolicy, AuthProvider, LeaveStatus, LeaveType, ScheduleStatus, ScheduleType } from "./enums";

export interface Organisation {
  organisationId: number;
  name: string;
  workArrangements: WorkArrangement;
  workTimeControlPolicy: WorkTimeControlPolicy;
  coreHoursStart: string; // TIME → ISO time string (HH:mm:ss)
  coreHoursEnd: string;
  minimumOfficeDays: number;
}

export interface Department {
  departmentId: number;
  organisationId: number;
  name: string;
  coreHoursStart: string | null;
  coreHoursEnd: string | null;
  minimumOfficeDays: number | null;
}

export interface Team {
  teamId: number;
  name: string;
  departmentId: number;
  managerId: number | null;
  coreHoursStart: string | null;
  coreHoursEnd: string | null;
  minimumOfficeDays: number | null;
}

export interface Employee {
  employeeId: number;
  name: string;
  email: string;
  role: string;
  teamId: number | null;
  departmentId: number;
  coreHoursStart: string | null;
  coreHoursEnd: string | null;
  minimumOfficeDays: number | null;
}

export interface Notification {
  notificationId: number;
  employeeId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AuthProviderRecord {
  employeeId: number;
  provider: AuthProvider;
  providerUserId: string;
  profilePictureUrl: string | null;
  providerEmail: string;
  providerDisplayName: string;
}

export interface LeaveRequest {
  leaveId: number;
  employeeId: number;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  type: LeaveType;
  doctorsNoteUrl: string | null;
  submittedAt: Date;
}

export interface Location {
  locationId: number;
  organisationId: number;
  name: string;
  capacity: number;
}

export interface Schedule {
  scheduleId: number;
  employeeId: number;
  date: Date;
  startTime1: string;
  endTime1: string;
  startTime2: string | null;
  endTime2: string | null;
  type: ScheduleType;
  locationId: number | null;
  status: ScheduleStatus;
}
