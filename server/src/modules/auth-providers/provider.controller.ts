import { Request, Response } from 'express';
import * as authProviderService from './provider.service';

export async function getAuthProviders(_req: Request, res: Response) {
  const providers = await authProviderService.getAllAuthProviders();
  res.json(providers);
}

export async function getAuthProvider(req: Request, res: Response) {
  const employeeId = Number(req.params.employeeId);
  const provider = req.params.provider;

  const authProvider = await authProviderService.getAuthProvider(employeeId, provider);

  if (!authProvider) {
    res.status(404).json({ message: 'AuthProvider not found' });
    return;
  }

  res.json(authProvider);
}

export async function createAuthProvider(req: Request, res: Response) {
  const authProvider = await authProviderService.createAuthProvider(req.body);
  res.status(201).json(authProvider);
}

export async function updateAuthProvider(req: Request, res: Response) {
  const employeeId = Number(req.params.employeeId);
  const provider = req.params.provider;

  await authProviderService.updateAuthProvider(employeeId, provider, req.body);
  res.status(204).send();
}

export async function deleteAuthProvider(req: Request, res: Response) {
  const employeeId = Number(req.params.employeeId);
  const provider = req.params.provider;

  await authProviderService.deleteAuthProvider(employeeId, provider);
  res.status(204).send();
}
