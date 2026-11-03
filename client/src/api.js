const API = 'http://localhost:5000/api';

let token = localStorage.getItem('token');

export const setToken = (t) => {
  token = t;
  localStorage.setItem('token', t);
};

export const getToken = () => token;

export const clearToken = () => {
  token = null;
  localStorage.removeItem('token');
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
});

export const auth = {
  register: (email, password, name) =>
    fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password, name })
    }).then(r => r.json()),

  login: (email, password) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password })
    }).then(r => r.json())
};

export const boards = {
  getAll: () =>
    fetch(`${API}/boards`, { headers: headers() }).then(r => r.json()),

  getOne: (id) =>
    fetch(`${API}/boards/${id}`, { headers: headers() }).then(r => r.json()),

  create: (title) =>
    fetch(`${API}/boards`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ title })
    }).then(r => r.json())
};

export const lists = {
  create: (title, boardId) =>
    fetch(`${API}/lists`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ title, boardId })
    }).then(r => r.json()),

  update: (id, data) =>
    fetch(`${API}/lists/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  delete: (id) =>
    fetch(`${API}/lists/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json())
};

export const cards = {
  create: (title, description, listId) =>
    fetch(`${API}/cards`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ title, description, listId })
    }).then(r => r.json()),

  update: (id, data) =>
    fetch(`${API}/cards/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  delete: (id) =>
    fetch(`${API}/cards/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json())
};
