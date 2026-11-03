import { useState, useEffect } from 'react';
import { boards } from '../api';

export default function BoardsList({ user, onSelectBoard, onLogout }) {
  const [boardsList, setBoardsList] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const data = await boards.getAll();
      setBoardsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const board = await boards.create(newTitle);
      setBoardsList([...boardsList, board]);
      setNewTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0079bf', color: 'white' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>📋 Trello</h1>
            <p style={{ fontSize: '14px', opacity: 0.8 }}>Organize your work</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'right',
              fontSize: '14px'
            }}>
              <span style={{ fontWeight: '600' }}>👤 {user.name || 'User'}</span>
              <span style={{ fontSize: '12px', opacity: 0.7 }}>{user.email}</span>
            </div>
            <button
              className="btn"
              onClick={onLogout}
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create Board Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>✨ Create New Board</h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Enter board name (e.g., My Project)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontWeight: '600' }}
            >
              Create Board
            </button>
          </form>
        </div>

        {/* Boards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '16px' }}>⏳ Loading your boards...</p>
          </div>
        ) : boardsList.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px dashed rgba(255, 255, 255, 0.2)'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>📭 No boards yet</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>Create your first board to get started</p>
          </div>
        ) : (
          <div>
            <h2 style={{ marginBottom: '20px', fontSize: '18px', opacity: 0.9 }}>
              Your Boards ({boardsList.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              {boardsList.map(board => (
                <div
                  key={board.id}
                  onClick={() => onSelectBoard(board.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: '600' }}>
                    {board.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    fontSize: '13px',
                    opacity: 0.8
                  }}>
                    <span>📊 {board.lists.length} list{board.lists.length !== 1 ? 's' : ''}</span>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      padding: '4px 8px',
                      borderRadius: '3px'
                    }}>
                      {board.lists.reduce((sum, l) => sum + l.cards.length, 0)} cards
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
