import { Router } from 'express';
import { db } from '../db/database.js';
import { DoubtQuery, DoubtReply } from '../types/shared.js';

export const guidanceRouter = Router();

// GET all doubt queries with filters
guidanceRouter.get('/doubts', (req, res) => {
  const { domain, category, status, search, studentId } = req.query;
  let doubts = db.getDoubts();

  if (domain && domain !== 'all') {
    doubts = doubts.filter(d => d.domain.toLowerCase() === (domain as string).toLowerCase());
  }

  if (category && category !== 'all') {
    doubts = doubts.filter(d => d.category === category);
  }

  if (status && status !== 'all') {
    doubts = doubts.filter(d => d.status === status);
  }

  if (studentId) {
    doubts = doubts.filter(d => d.studentId === studentId);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    doubts = doubts.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.queryText.toLowerCase().includes(q) ||
      d.tags.some(t => t.toLowerCase().includes(q)) ||
      d.studentName.toLowerCase().includes(q)
    );
  }

  res.json({ doubts });
});

// GET single doubt query by ID
guidanceRouter.get('/doubts/:id', (req, res) => {
  const doubt = db.getDoubtById(req.params.id);
  if (!doubt) {
    return res.status(404).json({ error: 'Doubt query not found' });
  }
  res.json({ doubt });
});

// POST new student doubt query
guidanceRouter.post('/doubts', (req, res) => {
  const { studentId, title, queryText, codeSnippet, domain, category, tags, urgency } = req.body;

  if (!studentId || !title || !queryText) {
    return res.status(400).json({ error: 'studentId, title, and queryText are required' });
  }

  const profile = db.getProfileById(studentId);
  const studentName = profile ? profile.fullName : 'Student';
  const studentEmail = profile ? profile.email : 'student@college.edu';

  const newDoubt: DoubtQuery = {
    id: `doubt-${Date.now()}`,
    studentId,
    studentName,
    studentEmail,
    title,
    queryText,
    codeSnippet: codeSnippet || undefined,
    domain: domain || 'Engineering & Tech',
    category: category || 'technical',
    tags: Array.isArray(tags) ? tags : (tags ? [tags] : ['Engineering']),
    urgency: urgency === 'urgent' ? 'urgent' : 'normal',
    status: 'open',
    createdAt: new Date().toISOString(),
    upvotes: 1,
    replies: []
  };

  db.saveDoubt(newDoubt);

  // Notify faculty mentors of new student query
  const notification = {
    id: `notif-${Date.now()}`,
    userId: 'user-balu',
    title: `New Student Query: ${studentName}`,
    message: `${studentName} posted a question on "${title}".`,
    type: 'mentor' as const,
    read: false,
    createdAt: new Date().toISOString(),
    link: `/guidance?id=${newDoubt.id}`
  };
  db.addNotification(notification);

  res.status(201).json({ success: true, doubt: newDoubt });
});

// POST reply to a doubt query (by Mentor, Industry Expert, or Peer)
guidanceRouter.post('/doubts/:id/replies', (req, res) => {
  const doubt = db.getDoubtById(req.params.id);
  if (!doubt) {
    return res.status(404).json({ error: 'Doubt query not found' });
  }

  const { authorId, authorName, authorRole, authorTitle, authorOrg, content, codeSnippet } = req.body;

  if (!content || !authorName) {
    return res.status(400).json({ error: 'content and authorName are required' });
  }

  const isExpertOrMentor = authorRole === 'mentor' || authorRole === 'industrial_expert' || authorRole === 'placement_cell';

  const newReply: DoubtReply = {
    id: `reply-${Date.now()}`,
    doubtId: doubt.id,
    authorId: authorId || `author-${Date.now()}`,
    authorName,
    authorRole: authorRole || 'student',
    authorTitle: authorTitle || (authorRole === 'mentor' ? 'Faculty Mentor' : authorRole === 'industrial_expert' ? 'Industry Practitioner' : 'Student Peer'),
    authorOrg: authorOrg || 'Academic Community',
    content,
    codeSnippet: codeSnippet || undefined,
    verified: isExpertOrMentor,
    upvotes: 0,
    createdAt: new Date().toISOString()
  };

  if (!doubt.replies) doubt.replies = [];
  doubt.replies.push(newReply);

  // Update doubt status to answered if previously open
  if (doubt.status === 'open') {
    doubt.status = 'answered';
  }

  db.saveDoubt(doubt);

  // Notify the student who asked the doubt
  const studentUser = db.getUserById(doubt.studentId) || db.getUsers().find(u => u.profileId === doubt.studentId);
  if (studentUser) {
    db.addNotification({
      id: `notif-${Date.now()}`,
      userId: studentUser.id,
      title: `Expert Reply from ${authorName}`,
      message: `${authorName} (${newReply.authorTitle}) replied to your doubt: "${doubt.title.slice(0, 40)}..."`,
      type: 'mentor',
      read: false,
      createdAt: new Date().toISOString(),
      link: `/guidance?id=${doubt.id}`
    });
  }

  res.status(201).json({ success: true, reply: newReply, doubt });
});

// POST upvote a doubt query
guidanceRouter.post('/doubts/:id/upvote', (req, res) => {
  const doubt = db.getDoubtById(req.params.id);
  if (!doubt) {
    return res.status(404).json({ error: 'Doubt query not found' });
  }

  doubt.upvotes = (doubt.upvotes || 0) + 1;
  db.saveDoubt(doubt);

  res.json({ success: true, upvotes: doubt.upvotes });
});

// POST mark doubt as resolved or toggle resolution status
guidanceRouter.post('/doubts/:id/resolve', (req, res) => {
  const doubt = db.getDoubtById(req.params.id);
  if (!doubt) {
    return res.status(404).json({ error: 'Doubt query not found' });
  }

  doubt.status = doubt.status === 'resolved' ? 'answered' : 'resolved';
  db.saveDoubt(doubt);

  res.json({ success: true, status: doubt.status });
});
