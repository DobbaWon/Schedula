import { Request, Response } from 'express';
import * as employeeService from './employees.service';

export async function getEmployees(_req: Request, res: Response) {
  const employees = await employeeService.getAllEmployees();
  res.json(employees);
}

export async function getEmployee(req: Request, res: Response) {
  const employeeId = Number(req.params.id);

  const employee = await employeeService.getEmployeeById(employeeId);

  if (!employee) {
    res.status(404).json({ message: 'Employee not found' });
    return;
  }

  res.json(employee);
}

export async function createEmployee(req: Request, res: Response) {
  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json(employee);
}

export async function updateEmployee(req: Request, res: Response) {
  const employeeId = Number(req.params.id);

  await employeeService.updateEmployee(employeeId, req.body);
  res.status(204).send();
}

export async function deleteEmployee(req: Request, res: Response) {
  const employeeId = Number(req.params.id);

  await employeeService.deleteEmployee(employeeId);
  res.status(204).send();
}
