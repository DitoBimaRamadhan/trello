const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'trello_super_secret_key';

// In-memory data store as fallback when DB is not connected
let memoryBoards = [
  {
    id: 'board-1',
    title: 'Pengembangan Aplikasi Q3',
    bg: 'bg-gradient-to-br from-blue-600 to-indigo-800',
    starred: true,
    lists: [
      {
        id: 'lst-1',
        title: 'To Do',
        cards: [
          { id: 'c-1', title: 'Perancangan Skema Database', description: 'Prisma & PostgreSQL', dueDate: '2026-11-12', labels: [{ color: 'bg-blue-500', text: 'Backend' }] }
        ]
      },
      { id: 'lst-2', title: 'In Progress', cards: [] },
      { id: 'lst-3', title: 'Done', cards: [] }
    ]
  }
];

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token diperlukan' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email & Password wajib diisi' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: 'u-' + Date.now(), email, name: name || email, password: hashedPassword };
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign({ id: 'u-1', email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: 'u-1', email, name: 'Dito Bima' } });
});

// Board Routes
app.get('/api/boards', (req, res) => {
  res.json(memoryBoards);
});

app.post('/api/boards', (req, res) => {
  const { title, bg } = req.body;
  const newBoard = {
    id: 'board-' + Date.now(),
    title: title || 'Board Baru',
    bg: bg || 'bg-gradient-to-br from-blue-600 to-indigo-800',
    starred: false,
    lists: [
      { id: 'l-' + Date.now() + '-1', title: 'To Do', cards: [] },
      { id: 'l-' + Date.now() + '-2', title: 'In Progress', cards: [] },
      { id: 'l-' + Date.now() + '-3', title: 'Done', cards: [] }
    ]
  };
  memoryBoards.push(newBoard);
  res.status(201).json(newBoard);
});

app.delete('/api/boards/:id', (req, res) => {
  memoryBoards = memoryBoards.filter(b => b.id !== req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Trello berjalan di port ${PORT}`);
});
