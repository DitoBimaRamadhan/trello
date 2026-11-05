import React, { useState, useEffect } from 'react';
import API from './api';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newListTitle, setNewListTitle] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [activeListId, setActiveListId] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await API.get('/boards');
      setBoards(res.data);
      if (res.data.length > 0 && !activeBoard) {
        setActiveBoard(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const res = await API.post('/boards', { title: newBoardTitle });
      setBoards([...boards, res.data]);
      setActiveBoard(res.data);
      setNewBoardTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 font-sans">
      <header className="bg-[#0052CC] text-white h-12 px-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-lg tracking-wider flex items-center space-x-2">
            <i className="fa-brands fa-trello"></i>
            <span>Trello Fullstack</span>
          </span>
        </div>
        <div className="text-sm font-semibold">Dito Bima Ramadhan</div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-4 space-y-4 shadow-sm">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daftar Board</h2>
          <div className="space-y-1">
            {boards.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBoard(b)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${activeBoard?.id === b.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                {b.title}
              </button>
            ))}
          </div>

          <form onSubmit={createBoard} className="pt-4 border-t space-y-2">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Nama board baru..."
              className="w-full border p-2 rounded text-sm outline-none focus:border-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-bold shadow transition">
              + Buat Board
            </button>
          </form>
        </aside>

        {/* Main Board View */}
        <main className={`flex-1 flex flex-col overflow-hidden ${activeBoard?.bg || 'bg-gradient-to-br from-blue-600 to-indigo-800'}`}>
          {activeBoard ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="bg-black/20 backdrop-blur-sm px-4 py-3 text-white flex items-center justify-between">
                <h1 className="text-xl font-bold">{activeBoard.title}</h1>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded">Workspace Publik</span>
              </div>

              <div className="flex-1 overflow-x-auto p-4 flex items-start space-x-4">
                {activeBoard.lists?.map(list => (
                  <div key={list.id} className="bg-[#F1F2F4] w-72 rounded-xl p-3 flex flex-col shadow-md shrink-0 max-h-full">
                    <div className="font-bold text-sm text-slate-800 mb-2 px-1">{list.title}</div>
                    <div className="space-y-2 overflow-y-auto flex-1">
                      {list.cards?.map(card => (
                        <div key={card.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-800">
                          {card.title}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white font-bold text-lg">
              Pilih atau buat board terlebih dahulu.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
