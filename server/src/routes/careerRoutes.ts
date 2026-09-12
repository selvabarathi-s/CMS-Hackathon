import { Router } from 'express';
import { db } from '../db/database.js';

export const careerRouter = Router();

// List all careers (with optional discipline filter)
careerRouter.get('/', (req, res) => {
  const { discipline, search } = req.query;
  let careers = db.getCareers(discipline as string);

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    careers = careers.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  res.json({ careers });
});

// Get single career by ID
careerRouter.get('/:id', (req, res) => {
  const career = db.getCareerById(req.params.id);
  if (!career) {
    return res.status(404).json({ error: 'Career not found' });
  }
  res.json({ career });
});

// Get all skills
careerRouter.get('/meta/skills', (req, res) => {
  const { discipline } = req.query;
  const skills = db.getSkills(discipline as string);
  res.json({ skills });
});
