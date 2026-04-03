import { useState, useCallback, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './HomePage.css';

interface TileDef {
  id: string;
  label: string;
  group: string;
  color: string;
  bg: string;
  bc: string;
  route?: string;
  svg: React.ReactNode;
}

const ALL_TILES: TileDef[] = [
  {
    id: 'entrata', label: 'Entrata Merci', group: 'Inbound Flow', color: '#185FA5', bg: '#EBF3FB', bc: '#B5D4F4',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="2" y="6" width="22" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M8 6V5a5 5 0 0 1 10 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M13 12v5M13 17l-2.5-2.5M13 17l2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    id: 'articoli', label: 'Articoli', group: 'MDM', color: '#0C3A6B', bg: '#EBF3FB', bc: '#85B7EB',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="20" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M7 9h12M7 13h12M7 17h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>,
  },
  {
    id: 'soggetti', label: 'Soggetti', group: 'MDM', color: '#27500A', bg: '#EAF3DE', bc: '#C0DD97',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="9" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M3 24c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  },
  {
    id: 'aree', label: 'Aree Magazzino', group: 'MDM', color: '#085041', bg: '#E1F5EE', bc: '#9FE1CB',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M2 10.5L13 3l11 7.5V24H2V10.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><rect x="9" y="15" width="8" height="9" stroke="currentColor" strokeWidth="1.4" /></svg>,
  },
  {
    id: 'utenti', label: 'User Authorization', group: 'Amministrazione', color: '#26215C', bg: '#EEEDFE', bc: '#AFA9EC', route: '/profile',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="12" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12V9a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="13" cy="18" r="2" fill="currentColor" /></svg>,
  },
  {
    id: 'tmov', label: 'Tipi Movimento', group: 'MDM', color: '#0C447C', bg: '#EBF3FB', bc: '#85B7EB',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M2 9h22M17 4l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M24 17H2M9 12l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    id: 'udm', label: 'Unità di Misura', group: 'MDM', color: '#633806', bg: '#FEF0E0', bc: '#FAC775',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M5 22V4M5 22h16M5 17h6M5 12h10M11 17v5M15 12v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    id: 'picking', label: 'Stato Picking', group: 'Outbound Flow', color: '#3B6D11', bg: '#EAF3DE', bc: '#C0DD97',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 13l6 6 12-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  },
  {
    id: 'report', label: 'Report', group: 'Amministrazione', color: '#0F6E56', bg: '#EAF3DE', bc: '#C0DD97',
    svg: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="3" width="20" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M7 19V14M11 19V10M15 19V12M19 19V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>,
  },
];

const DEFAULT_TILES = ['entrata', 'articoli', 'soggetti', 'aree', 'utenti', 'tmov'];

const DAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MONTHS = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userTiles, setUserTiles] = useState<string[]>(DEFAULT_TILES);
  const [editMode, setEditMode] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addSelected, setAddSelected] = useState<Set<string>>(new Set());
  const [dragSrcIdx, setDragSrcIdx] = useState<number | null>(null);

  const now = new Date();
  const hr = now.getHours();
  const greet = hr < 12 ? 'Buongiorno' : hr < 18 ? 'Buon pomeriggio' : 'Buonasera';
  const dateStr = `${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()} — Stabilimento ${user?.tenant ?? 'MVN'}`;

  const tiles = userTiles.map(id => ALL_TILES.find(t => t.id === id)).filter(Boolean) as TileDef[];

  const removeTile = useCallback((id: string) => {
    setUserTiles(prev => prev.filter(t => t !== id));
  }, []);

  function handleDragStart(idx: number) {
    setDragSrcIdx(idx);
  }

  function handleDrop(e: DragEvent, toIdx: number) {
    e.preventDefault();
    if (dragSrcIdx === null || dragSrcIdx === toIdx) return;
    setUserTiles(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragSrcIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
    setDragSrcIdx(null);
  }

  function openAddModal() {
    setAddSelected(new Set());
    setAddModalOpen(true);
  }

  function confirmAdd() {
    setUserTiles(prev => {
      const next = [...prev];
      addSelected.forEach(id => { if (!next.includes(id)) next.push(id); });
      return next;
    });
    setAddModalOpen(false);
  }

  function handleTileClick(tile: TileDef) {
    if (editMode) return;
    if (tile.route) navigate(tile.route);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Welcome header */}
      <div className="home-header">
        <div>
          <div className="home-greeting">{greet}, {user?.name?.split(' ')[0] ?? 'User'}</div>
          <div className="home-date">{dateStr}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className={`btn-home btn-home-sm${editMode ? '' : ''}`}
            onClick={() => setEditMode(!editMode)}
            style={editMode ? { background: '#FEF0E0', borderColor: '#FAC775', color: '#633806' } : {}}>
            {editMode ? (
              <>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Annulla
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 1.5l2.5 2.5-7 7H1v-2.5l7-7z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                Personalizza
              </>
            )}
          </button>
          {editMode && (
            <button className="btn-home btn-home-sm btn-home-primary" onClick={openAddModal}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              Aggiungi collegamento
            </button>
          )}
        </div>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="edit-banner">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#185FA5" strokeWidth="1.3" /><path d="M7 6v4M7 4.5v.1" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round" /></svg>
          <span className="edit-banner-title">Modalità personalizzazione attiva</span>
          <span className="edit-banner-sub">Clicca la X per rimuovere un tile, trascina per riordinare, aggiungi nuovi collegamenti</span>
          <button className="btn-home btn-home-sm btn-home-primary" style={{ marginLeft: 'auto' }}
            onClick={() => setEditMode(false)}>Salva e chiudi</button>
        </div>
      )}

      {/* Stats row */}
      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EBF3FB', color: '#185FA5' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M5 4V3a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><path d="M1 8h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </div>
          <div><div className="stat-num">15.340</div><div className="stat-lbl">Articoli totali</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EAF3DE', color: '#1a8a5a' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div><div className="stat-num" style={{ color: '#1a8a5a' }}>14.892</div><div className="stat-lbl">Attivi</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEF0E0', color: '#BA7517' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div><div className="stat-num" style={{ color: '#BA7517' }}>151</div><div className="stat-lbl">Entrate in corso</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EEEDFE', color: '#26215C' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M2.5 14c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </div>
          <div><div className="stat-num" style={{ color: '#26215C' }}>108</div><div className="stat-lbl">Utenti attivi</div></div>
        </div>
      </div>

      {/* Tiles grid */}
      {tiles.length === 0 ? (
        <div className="tiles-empty">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" style={{ margin: '0 auto 14px', display: 'block' }}>
            <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="#C8D9EA" strokeWidth="1.5" />
            <rect x="24" y="4" width="16" height="16" rx="2.5" stroke="#C8D9EA" strokeWidth="1.5" />
            <rect x="4" y="24" width="16" height="16" rx="2.5" stroke="#C8D9EA" strokeWidth="1.5" />
            <rect x="24" y="24" width="16" height="16" rx="2.5" stroke="#C8D9EA" strokeWidth="1.5" />
            <path d="M32 28v8M28 32h8" stroke="#C8D9EA" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <div className="tiles-empty-title">Nessun collegamento rapido</div>
          <div className="tiles-empty-sub">Aggiungi le pagine che usi di più</div>
          <button className="btn-home btn-home-primary" onClick={openAddModal}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            Aggiungi collegamento
          </button>
        </div>
      ) : (
        <div className="tiles-grid">
          {tiles.map((tile, idx) => (
            <div
              key={tile.id}
              className="home-tile"
              draggable={editMode}
              onDragStart={() => handleDragStart(idx)}
              onDragEnd={() => setDragSrcIdx(null)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, idx)}
              onClick={() => handleTileClick(tile)}
              onMouseEnter={e => { if (!editMode) { (e.currentTarget as HTMLElement).style.borderColor = tile.color; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = tile.bc; }}
              style={{ border: `1.5px solid ${tile.bc}`, cursor: tile.route && !editMode ? 'pointer' : editMode ? 'grab' : 'default' }}
            >
              {editMode && (
                <>
                  <button className="tile-remove-btn" onClick={e => { e.stopPropagation(); removeTile(tile.id); }}>&#10005;</button>
                  <div className="tile-drag-handle">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="4" cy="3" r="1" fill="currentColor" /><circle cx="8" cy="3" r="1" fill="currentColor" /><circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="8" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="9" r="1" fill="currentColor" /><circle cx="8" cy="9" r="1" fill="currentColor" /></svg>
                  </div>
                </>
              )}
              <div className="tile-icon-wrap" style={{ background: tile.bg, color: tile.color }}>
                {tile.svg}
              </div>
              <div style={{ flex: 1 }}>
                <div className="tile-label">{tile.label}</div>
                <div className="tile-group">{tile.group}</div>
              </div>
              {!editMode && (
                <div className="tile-link" style={{ color: tile.color }}>
                  Apri
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H5M8 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add tile modal */}
      {addModalOpen && (
        <div className="add-tile-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="add-tile-modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0C3A6B', marginBottom: 3 }}>Aggiungi collegamento rapido</div>
            <div style={{ fontSize: 12, color: '#5a7a99', marginBottom: 16 }}>Seleziona le pagine da aggiungere alla tua home</div>
            <div className="add-tile-grid">
              {ALL_TILES.map(tile => {
                const alreadyAdded = userTiles.includes(tile.id);
                const selected = addSelected.has(tile.id);
                return (
                  <div
                    key={tile.id}
                    className={`add-tile-card${alreadyAdded ? ' add-tile-card-added' : ''}`}
                    onClick={() => {
                      if (alreadyAdded) return;
                      setAddSelected(prev => {
                        const next = new Set(prev);
                        if (next.has(tile.id)) next.delete(tile.id); else next.add(tile.id);
                        return next;
                      });
                    }}
                    style={{
                      border: `1.5px solid ${alreadyAdded ? '#C0DD97' : selected ? '#85B7EB' : '#D9E4EF'}`,
                      background: alreadyAdded ? '#EAF3DE' : selected ? '#EBF3FB' : '#F7FAFD',
                    }}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: tile.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tile.color, flexShrink: 0 }}>
                      <svg viewBox="0 0 26 26" width="18" height="18">{(tile.svg as React.ReactElement).props.children}</svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0C3A6B' }}>{tile.label}</div>
                      <div style={{ fontSize: 10, color: '#8aA8C0' }}>{tile.group}</div>
                    </div>
                    {alreadyAdded ? (
                      <span style={{ fontSize: 10, color: '#27500A', fontWeight: 500, whiteSpace: 'nowrap' }}>Già presente</span>
                    ) : (
                      <div className={`add-tile-check${selected ? ' selected' : ''}`}>
                        {selected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexShrink: 0 }}>
              <button className="btn-home" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setAddModalOpen(false)}>Annulla</button>
              <button className="btn-home btn-home-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={confirmAdd}>Aggiungi selezionati</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
