CREATE TABLE Organisations (
    OrganisationID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    WorkArrangements NVARCHAR(20) NOT NULL,
    WorkTimeControlPolicy NVARCHAR(30) NOT NULL,
    CoreHoursStart TIME NOT NULL,
    CoreHoursEnd TIME NOT NULL,
    MinimumOfficeDays INT NOT NULL,
    CONSTRAINT CK_Organisations_WorkArrangements 
        CHECK (WorkArrangements IN ('Remote', 'Hybrid', 'In-Office')),
    CONSTRAINT CK_Organisations_WorkTimeControlPolicy 
        CHECK (WorkTimeControlPolicy IN ('Employee-Based', 'Manager-Based'))
);

CREATE TABLE Departments (
    DepartmentID INT IDENTITY PRIMARY KEY,
    OrganisationID INT NOT NULL,
    Name NVARCHAR(255) NOT NULL,
    CoreHoursStart TIME NULL,
    CoreHoursEnd TIME NULL,
    MinimumOfficeDays INT NULL
);

CREATE TABLE Teams (
    TeamID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    DepartmentID INT NOT NULL,
    ManagerID INT NULL,
    CoreHoursStart TIME NULL,
    CoreHoursEnd TIME NULL,
    MinimumOfficeDays INT NULL
);

CREATE TABLE Employees (
    EmployeeID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Role NVARCHAR(100) NOT NULL,
    TeamID INT NULL,
    DepartmentID INT NOT NULL,
    CoreHoursStart TIME NULL,
    CoreHoursEnd TIME NULL,
    MinimumOfficeDays INT NULL
);

CREATE TABLE Notifications (
    NotificationID INT IDENTITY PRIMARY KEY,
    EmployeeID INT NOT NULL,
    Type NVARCHAR(50) NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    [Read] BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE AuthProviders (
    EmployeeID INT NOT NULL,
    Provider NVARCHAR(20) NOT NULL,
    ProviderUserID NVARCHAR(255) NOT NULL,
    ProfilePictureURL NVARCHAR(500) NULL,
    ProviderEmail NVARCHAR(255) NOT NULL,
    ProviderDisplayName NVARCHAR(255) NOT NULL,
    CONSTRAINT PK_AuthProviders PRIMARY KEY (EmployeeID, Provider),
    CONSTRAINT CK_AuthProviders_Provider 
        CHECK (Provider IN ('Google', 'Microsoft'))
);

CREATE TABLE LeaveRequests (
    LeaveID INT IDENTITY PRIMARY KEY,
    EmployeeID INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    Type NVARCHAR(30) NOT NULL,
    DoctorsNoteURL NVARCHAR(500) NULL,
    SubmittedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_Leave_Status 
        CHECK (Status IN ('Approved', 'Rejected', 'Submitted')),
    CONSTRAINT CK_Leave_Type 
        CHECK (Type IN ('Holiday', 'Sick', 'Maternity', 'Un-Paid Leave'))
);

CREATE TABLE Locations (
    LocationID INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Capacity INT NOT NULL
);

CREATE TABLE Schedules (
    ScheduleID INT IDENTITY PRIMARY KEY,
    EmployeeID INT NOT NULL,
    [Date] DATE NOT NULL,
    StartTime1 TIME NOT NULL,
    EndTime1 TIME NOT NULL,
    StartTime2 TIME NULL,
    EndTime2 TIME NULL,
    Type NVARCHAR(20) NOT NULL,
    LocationID INT NULL,
    Status NVARCHAR(20) NOT NULL,
    CONSTRAINT CK_Schedules_Type 
        CHECK (Type IN ('Remote', 'In-Office')),
    CONSTRAINT CK_Schedules_Status 
        CHECK (Status IN ('Approved', 'Rejected', 'Submitted'))
);

ALTER TABLE Departments
ADD CONSTRAINT FK_Departments_Organisations
FOREIGN KEY (OrganisationID) REFERENCES Organisations(OrganisationID);

ALTER TABLE Teams
ADD CONSTRAINT FK_Teams_Departments
FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID);

ALTER TABLE Teams
ADD CONSTRAINT FK_Teams_Manager
FOREIGN KEY (ManagerID) REFERENCES Employees(EmployeeID);

ALTER TABLE Employees
ADD CONSTRAINT FK_Employees_Teams
FOREIGN KEY (TeamID) REFERENCES Teams(TeamID);

ALTER TABLE Employees
ADD CONSTRAINT FK_Employees_Departments
FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID);

ALTER TABLE Notifications
ADD CONSTRAINT FK_Notifications_Employees
FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);

ALTER TABLE AuthProviders
ADD CONSTRAINT FK_AuthProviders_Employees
FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);

ALTER TABLE LeaveRequests
ADD CONSTRAINT FK_Leave_Employees
FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);

ALTER TABLE Schedules
ADD CONSTRAINT FK_Schedules_Employees
FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);

ALTER TABLE Schedules
ADD CONSTRAINT FK_Schedules_Locations
FOREIGN KEY (LocationID) REFERENCES Locations(LocationID);
