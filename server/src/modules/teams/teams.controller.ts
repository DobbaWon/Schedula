import { Request, Response } from 'express';
import * as teamService from './teams.service';

export async function getTeams(_req: Request, res: Response) {
  const teams = await teamService.getAllTeams();
  res.json(teams);
}

export async function getTeam(req: Request, res: Response) {
  const teamId = Number(req.params.id);
  const team = await teamService.getTeamById(teamId);

  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  res.json(team);
}

export async function createTeam(req: Request, res: Response) {
  const team = await teamService.createTeam(req.body);
  res.status(201).json(team);
}

export async function updateTeam(req: Request, res: Response) {
  const teamId = Number(req.params.id);
  await teamService.updateTeam(teamId, req.body);
  res.status(204).send();
}

export async function deleteTeam(req: Request, res: Response) {
  const teamId = Number(req.params.id);
  await teamService.deleteTeam(teamId);
  res.status(204).send();
}
