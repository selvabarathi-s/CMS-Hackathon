import { Router } from 'express';
import { db } from '../db/database.js';
import { AIMentorService } from '../services/aiMentorService.js';

export const aiMentorRouter = Router();

// Get chat history for student
aiMentorRouter.get('/history/:studentId', (req, res) => {
  const history = db.getChatHistory(req.params.studentId);
  res.json({ history });
});

// Post a question to AI Mentor
aiMentorRouter.post('/chat', async (req, res) => {
  const { studentId, message } = req.body;
  const profile = db.getProfileById(studentId) || db.getProfiles()[0];

  try {
    const aiResponse = await AIMentorService.generateGuidance(profile, message);
    res.json({ message: aiResponse });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate guidance' });
  }
});
