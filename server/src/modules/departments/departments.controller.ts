import { Request, Response } from 'express';
import * as departmentService from './departments.service';

export async function getDepartments(_req: Request, res: Response) {
  const departments = await departmentService.getAllDepartments();
  res.json(departments);
}

export async function getDepartment(req: Request, res: Response) {
  const departmentId = Number(req.params.id);
  const department = await departmentService.getDepartmentById(departmentId);

  if (!department) {
    res.status(404).json({ message: 'Department not found' });
    return;
  }

  res.json(department);
}

export async function createDepartment(req: Request, res: Response) {
  const department = await departmentService.createDepartment(req.body);
  res.status(201).json(department);
}

export async function updateDepartment(req: Request, res: Response) {
  const departmentId = Number(req.params.id);
  await departmentService.updateDepartment(departmentId, req.body);
  res.status(204).send();
}

export async function deleteDepartment(req: Request, res: Response) {
  const departmentId = Number(req.params.id);
  await departmentService.deleteDepartment(departmentId);
  res.status(204).send();
}
