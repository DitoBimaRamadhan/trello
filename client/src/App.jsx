import { useState, useEffect } from 'react';
import { getToken, setToken, clearToken } from './api';
import Login from './pages/Login';
import BoardsList from './pages/BoardsList';
import Board from './pages/Board';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentBoardId, setCurrentBoardId] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Decode token to get user (in real app, fetch user endpoint)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId });
      } catch (e) {
        clearToken();
      }
    }
  }, []);

  if (!user) {
    return <Login onLogin={(userData, token) => {
      setToken(token);
      setUser(userData);
    }} />;
  }

  return currentBoardId ? (
    <Board boardId={currentBoardId} user={user} onBack={() => setCurrentBoardId(null)} />
  ) : (
    <BoardsList user={user} onSelectBoard={setCurrentBoardId} onLogout={() => {
      clearToken();
      setUser(null);
    }} />
  );
}
