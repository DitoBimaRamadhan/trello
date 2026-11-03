import { useState, useEffect } from 'react';
import { boards, lists, cards } from '../api';
import CardModal from '../components/CardModal';

export default function Board({ boardId, user, onBack }) {
  const [board, setBoard] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    try {
      const data = await boards.getOne(boardId);
      setBoard(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const newList = await lists.create(newListTitle, boardId);
      setBoard({
        ...board,
        lists: [...board.lists, newList]
      });
      setNewListTitle('');
      setShowAddList(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCard = async (listId, title, description) => {
    try {
      const newCard = await cards.create(title, description, listId);
      setBoard({
        ...board,
        lists: board.lists.map(l =>
          l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
        )
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await cards.delete(cardId);
      setBoard({
        ...board,
        lists: board.lists.map(l => ({
          ...l,
          cards: l.cards.filter(c => c.id !== cardId)
        }))
      });
      setSelectedCard(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCard = async (cardId, data) => {
    try {
      await cards.update(cardId, data);
      setBoard({
        ...board,
        lists: board.lists.map(l => ({
          ...l,
          cards: l.cards.map(c =>
            c.id === cardId ? { ...c, ...data } : c
          )
        }))
      });
      setSelectedCard({ ...selectedCard, ...data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveCard = async (cardId, toListId) => {
    try {
      const card = board.lists
        .flatMap(l => l.cards)
        .find(c => c.id === cardId);

      if (!card) return;

      await cards.update(cardId, { listId: toListId });
      setBoard({
        ...board,
        lists: board.lists.map(l => ({
          ...l,
          cards: l.cards.filter(c => c.id !== cardId)
        })).map(l =>
          l.id === toListId ? { ...l, cards: [...l.cards, card] } : l
        )
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteList = async (listId) => {
    if (confirm('Delete this list and all its cards?')) {
      try {
        await lists.delete(listId);
        setBoard({
          ...board,
          lists: board.lists.filter(l => l.id !== listId)
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, listId) => {
    e.preventDefault();
    if (draggedCard) {
      handleMoveCard(draggedCard.id, listId);
      setDraggedCard(null);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0079bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontSize: '18px' }}>⏳ Loading board...</p>
    </div>
  );
  if (!board) return (
    <div style={{ minHeight: '100vh', background: '#0079bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontSize: '18px' }}>❌ Board not found</p>
    </div>
  );

  const totalCards = board.lists.reduce((sum, l) => sum + l.cards.length, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0079bf', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.15)',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
            <button
              className="btn"
              onClick={onBack}
              style={{ background: 'rgba(255, 255, 255, 0.2)', fontSize: '16px' }}
            >
              ← Back
            </button>
            <div>
              <h1 style={{ fontSize: '24px', marginBottom: '4px' }}>{board.title}</h1>
              <p style={{ fontSize: '13px', opacity: 0.8 }}>
                {board.lists.length} list{board.lists.length !== 1 ? 's' : ''} • {totalCards} card{totalCards !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        <div className="board-container">
          {board.lists.map(list => (
            <div key={list.id} className="list" style={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
              overflow: 'visible'
            }}>
              <div className="list-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#f0f0f0'
              }}>
                <div className="list-header-title" style={{
                  fontWeight: '600',
                  fontSize: '15px'
                }}>
                  {list.title}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{
                    background: '#e0e0e0',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#626f86',
                    fontWeight: '500'
                  }}>
                    {list.cards.length}
                  </span>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#626f86',
                      cursor: 'pointer',
                      fontSize: '18px',
                      padding: '0 4px'
                    }}
                    onClick={() => handleDeleteList(list.id)}
                    title="Delete list"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div
                className="list-cards"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, list.id)}
                style={{ minHeight: '100px' }}
              >
                {list.cards.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#bbb',
                    padding: '20px 8px',
                    fontSize: '13px'
                  }}>
                    📭 No cards
                  </div>
                ) : (
                  list.cards.map(card => (
                    <div
                      key={card.id}
                      className="card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, card)}
                      onClick={() => setSelectedCard(card)}
                      style={{
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div className="card-text" style={{ fontWeight: '500' }}>
                        {card.title}
                      </div>
                      {card.description && (
                        <div style={{
                          fontSize: '12px',
                          color: '#626f86',
                          marginTop: '8px',
                          lineHeight: '1.4'
                        }}>
                          {card.description.length > 60
                            ? card.description.substring(0, 60) + '...'
                            : card.description}
                        </div>
                      )}
                      <div style={{
                        fontSize: '11px',
                        color: '#bbb',
                        marginTop: '8px'
                      }}>
                        📝 Click to edit
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="add-card">
                <button
                  className="add-card-btn"
                  onClick={() => {
                    const title = prompt('Card title:');
                    if (title) handleAddCard(list.id, title, '');
                  }}
                  style={{ fontWeight: '500' }}
                >
                  + Add card
                </button>
              </div>
            </div>
          ))}

          {/* Add List */}
          <div style={{
            width: '272px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {showAddList ? (
              <form onSubmit={handleAddList} style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '3px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <input
                  type="text"
                  placeholder="List title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  autoFocus
                  style={{
                    padding: '8px 12px',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '3px',
                    background: 'white',
                    color: '#172b4d',
                    fontSize: '14px'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '8px' }}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setShowAddList(false);
                      setNewListTitle('');
                    }}
                    style={{ flex: 1, padding: '8px', background: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="add-list"
                onClick={() => setShowAddList(true)}
              >
                + Add another list
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          lists={board.lists}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
          onMove={handleMoveCard}
        />
      )}
    </div>
  );
}
