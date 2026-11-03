import { useState } from 'react';

export default function CardModal({ card, lists, onClose, onUpdate, onDelete, onMove }) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (title.trim()) {
      await onUpdate(card.id, { title, description });
      setIsEditing(false);
    }
  };

  const handleMove = async (newListId) => {
    if (newListId !== card.listId) {
      await onMove(card.id, newListId);
      onClose();
    }
  };

  const handleDelete = () => {
    if (confirm('🗑️ Permanently delete this card?')) {
      onDelete(card.id);
    }
  };

  const currentList = lists.find(l => l.id === card.listId);

  return (
    <div
      className="modal active"
      onClick={onClose}
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#f8f9fa',
          maxWidth: '560px'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '24px',
          paddingBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', marginBottom: '4px', color: '#172b4d' }}>
              Card Details
            </h2>
            <p style={{ fontSize: '13px', color: '#626f86' }}>
              📊 List: {currentList?.title || 'Unknown'}
            </p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              color: '#626f86',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '3px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div className="modal-field" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#172b4d',
            textTransform: 'uppercase'
          }}>
            ✏️ Title
          </label>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #5e72e4',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                boxShadow: '0 0 0 2px rgba(94, 114, 228, 0.1)'
              }}
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#172b4d',
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.borderColor = '#5e72e4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              {title}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="modal-field" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#172b4d',
            textTransform: 'uppercase'
          }}>
            📝 Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleSave}
            placeholder="Add a detailed description..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '120px',
              lineHeight: '1.5',
              transition: 'border 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#5e72e4'}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e0e0';
              handleSave();
            }}
          />
        </div>

        {/* Move to List */}
        <div className="modal-field" style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#172b4d',
            textTransform: 'uppercase'
          }}>
            🔄 Move to List
          </label>
          <select
            value={card.listId}
            onChange={(e) => handleMove(parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer',
              transition: 'border 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#5e72e4'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          >
            {lists.map(list => (
              <option key={list.id} value={list.id}>
                {list.title} ({list.cards.length} cards)
              </option>
            ))}
          </select>
        </div>

        {/* Card Info */}
        <div style={{
          background: '#f0f0f0',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#626f86',
          marginBottom: '24px'
        }}>
          <p>🕐 Created: {new Date(card.createdAt).toLocaleDateString()}</p>
          {card.updatedAt && card.updatedAt !== card.createdAt && (
            <p>📝 Last updated: {new Date(card.updatedAt).toLocaleDateString()}</p>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderTop: '1px solid #e0e0e0',
          paddingTop: '24px'
        }}>
          {isEditing && (
            <>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#5e72e4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#4c63d2'}
                onMouseLeave={(e) => e.target.style.background = '#5e72e4'}
              >
                ✓ Save Changes
              </button>
              <button
                onClick={() => {
                  setTitle(card.title);
                  setDescription(card.description || '');
                  setIsEditing(false);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#e0e0e0',
                  color: '#172b4d',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
                onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
              >
                ✕ Cancel
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            style={{
              padding: '12px 24px',
              background: '#f56565',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e53e3e'}
            onMouseLeave={(e) => e.target.style.background = '#f56565'}
          >
            🗑️ Delete
          </button>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                flex: 1,
                padding: '12px',
                background: '#5e72e4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4c63d2'}
              onMouseLeave={(e) => e.target.style.background = '#5e72e4'}
            >
              ✏️ Edit
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: '#e0e0e0',
              color: '#172b4d',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#d0d0d0'}
            onMouseLeave={(e) => e.target.style.background = '#e0e0e0'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
