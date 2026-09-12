import { Router } from 'express';
import { db } from '../db/database.js';
import { SimulatorService } from '../services/simulatorService.js';

export const simulatorRouter = Router();

// Run career pivot simulation
simulatorRouter.post('/simulate', (req, res) => {
  const { studentId, sourceCareerId, targetCareerId } = req.body;
  const profile = db.getProfileById(studentId) || db.getProfiles()[0];

  const result = SimulatorService.simulatePivot(profile, sourceCareerId, targetCareerId);

  if (!result) {
    return res.status(400).json({ error: 'Invalid source or target career ID' });
  }

  res.json({ result });
});
