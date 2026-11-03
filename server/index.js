import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Auth
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hash, name }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Boards: Get all
app.get('/api/boards', auth, async (req, res) => {
  const boards = await prisma.board.findMany({
    where: { userId: req.userId },
    include: { lists: { include: { cards: true }, orderBy: { order: 'asc' } } }
  });
  res.json(boards);
});

// Boards: Create
app.post('/api/boards', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const board = await prisma.board.create({
      data: { title, userId: req.userId },
      include: { lists: { include: { cards: true } } }
    });
    res.json(board);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Boards: Get one
app.get('/api/boards/:id', auth, async (req, res) => {
  const board = await prisma.board.findFirst({
    where: { id: parseInt(req.params.id), userId: req.userId },
    include: { lists: { include: { cards: true }, orderBy: { order: 'asc' } } }
  });

  if (!board) return res.status(404).json({ error: 'Board not found' });
  res.json(board);
});

// Lists: Create
app.post('/api/lists', auth, async (req, res) => {
  try {
    const { title, boardId } = req.body;

    // Check board ownership
    const board = await prisma.board.findFirst({
      where: { id: boardId, userId: req.userId }
    });
    if (!board) return res.status(403).json({ error: 'Not authorized' });

    const maxOrder = await prisma.list.aggregate({
      where: { boardId },
      _max: { order: true }
    });

    const list = await prisma.list.create({
      data: { title, boardId, order: (maxOrder._max.order || 0) + 1 },
      include: { cards: true }
    });
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lists: Update
app.put('/api/lists/:id', auth, async (req, res) => {
  try {
    const { title, order } = req.body;
    const listId = parseInt(req.params.id);

    // Check ownership via board
    const list = await prisma.list.findUnique({ where: { id: listId }, include: { board: true } });
    if (!list || list.board.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.list.update({
      where: { id: listId },
      data: { ...(title && { title }), ...(order !== undefined && { order }) },
      include: { cards: true }
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lists: Delete
app.delete('/api/lists/:id', auth, async (req, res) => {
  try {
    const listId = parseInt(req.params.id);
    const list = await prisma.list.findUnique({ where: { id: listId }, include: { board: true } });

    if (!list || list.board.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.list.delete({ where: { id: listId } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cards: Create
app.post('/api/cards', auth, async (req, res) => {
  try {
    const { title, description, listId } = req.body;

    // Check auth via list->board
    const list = await prisma.list.findUnique({ where: { id: listId }, include: { board: true } });
    if (!list || list.board.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const maxOrder = await prisma.card.aggregate({
      where: { listId },
      _max: { order: true }
    });

    const card = await prisma.card.create({
      data: { title, description: description || '', listId, order: (maxOrder._max.order || 0) + 1 }
    });
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cards: Update
app.put('/api/cards/:id', auth, async (req, res) => {
  try {
    const { title, description, listId, order } = req.body;
    const cardId = parseInt(req.params.id);

    const card = await prisma.card.findUnique({ where: { id: cardId }, include: { list: { include: { board: true } } } });
    if (!card || card.list.board.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.card.update({
      where: { id: cardId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(listId && { listId }),
        ...(order !== undefined && { order })
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cards: Delete
app.delete('/api/cards/:id', auth, async (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const card = await prisma.card.findUnique({ where: { id: cardId }, include: { list: { include: { board: true } } } });

    if (!card || card.list.board.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.card.delete({ where: { id: cardId } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
