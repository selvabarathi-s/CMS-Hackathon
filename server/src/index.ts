import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes.js';
import { careerRouter } from './routes/careerRoutes.js';
import { profileRouter } from './routes/profileRoutes.js';
import { assessmentRouter } from './routes/assessmentRoutes.js';
import { roadmapRouter } from './routes/roadmapRoutes.js';
import { simulatorRouter } from './routes/simulatorRoutes.js';
import { aiMentorRouter } from './routes/aiMentorRoutes.js';
import { mentorRouter } from './routes/mentorRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { mobileRouter } from './routes/mobileRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Route Mounts
app.use('/api/auth', authRouter);
app.use('/api/careers', careerRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/roadmaps', roadmapRouter);
app.use('/api/simulator', simulatorRouter);
app.use('/api/ai-mentor', aiMentorRouter);
app.use('/api/mentor', mentorRouter);
app.use('/api/admin', adminRouter);
app.use('/api/mobile', mobileRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), platform: 'CareerBridge API v1.0' });
});

app.listen(PORT, () => {
  console.log(`🚀 CareerBridge API Server running on port ${PORT}`);
});
