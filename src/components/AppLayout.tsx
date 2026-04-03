import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { isAdmin } from '../rbac/roles';
import { getMenuData, type MenuGroup } from '../data/menuData';
import './AppLayout.css';

const menuData = getMenuData();

const GROUP_ICONS: Record<string, React.ReactNode> = {
  'grp-inbound': <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" /></svg>,
  'grp-outbound': <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7H2M7 3l-4 4 4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" /></svg>,
  'grp-warehouse': <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 5.5L7 2l6 3.5V13H1V5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><rect x="4.5" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3" /></svg>,
  'grp-mdm': <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><ellipse cx="7" cy="4" rx="5" ry="2" stroke="currentColor" strokeWidth="1.3" /><path d="M2 4v3c0 1.1 2.24 2 5 2s5-.9 5-2V4" stroke="currentColor" strokeWidth="1.3" /><path d="M2 7v3c0 1.1 2.24 2 5 2s5-.9 5-2V7" stroke="currentColor" strokeWidth="1.3" /></svg>,
  'grp-admin': <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
};

const BREADCRUMBS: Record<string, React.ReactNode> = {
  '/': <b>Home</b>,
  '/profile': <><span>Amministrazione</span><span style={{ color: '#C8D9EA' }}>&#8250;</span><b>Profilo</b></>,
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ 'grp-inbound': true, 'grp-mdm': true, 'grp-admin': true });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownOpen && btnRef.current && !btnRef.current.contains(e.target as Node) && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [dropdownOpen]);

  function toggleGroup(id: string) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate('/login', { replace: true });
  }

  function handleItemClick(route?: string) {
    if (route) navigate(route);
  }

  function renderGroup(group: MenuGroup) {
    const isAdminGroup = group.id === 'grp-admin';
    if (isAdminGroup && user && !isAdmin(user.role)) return null;

    const accentStyle = group.accent
      ? { background: 'rgba(55,138,221,.18)', borderLeftColor: '#378ADD', color: '#fff' } as const
      : undefined;

    return (
      <div key={group.id}>
        {group.section && (
          <>
            <div className="sb-divider" />
            <div className="sb-section">{group.section}</div>
          </>
        )}
        <button
          className={`sb-group-hd${!openGroups[group.id] ? ' collapsed' : ''}`}
          onClick={() => toggleGroup(group.id)}
          style={accentStyle}
        >
          <span className="sb-icon">{GROUP_ICONS[group.id]}</span>
          {group.label}
          <span className="sb-gtog">&#9660;</span>
        </button>
        {openGroups[group.id] && (
          <div className="sb-group-body">
            {group.items.map(item => (
              <button
                key={item.id}
                className={`sb-item sb-sub${item.route && location.pathname === item.route ? ' active' : ''}`}
                onClick={() => handleItemClick(item.route)}
                style={{ opacity: item.route ? 1 : 0.5 }}
              >
                <span className="sb-icon">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="2.5" fill="rgba(255,255,255,0.4)" /></svg>
                </span>
                {item.label}
                {item.badge && <span className="sb-badge">{item.badge}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Overlay for mobile when drawer is open */}
      {drawerOpen && <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* ── Sidebar / Drawer ── */}
      <div className={`sidebar${drawerOpen ? ' open' : ''}`}>
        <div className="sb-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="sb-logo-box">WMS</div>
              <div className="sb-brand">MVN WMS</div>
              <div className="sb-brand-sub">Warehouse Management</div>
            </div>
            <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)} title="Chiudi menu">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: '8px 10px 4px' }}>
          <div className="sb-search-wrap">
            <svg className="sb-search-ico" width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.3" /><path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            <input className="sb-search-inp" placeholder="Cerca nel menu..." />
          </div>
        </div>

        <div className="sb-scroll">
          {/* Home link */}
          <button className={`sb-item${location.pathname === '/' ? ' active' : ''}`} onClick={() => navigate('/')} style={{ margin: '6px 6px 0' }}>
            <span className="sb-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1.5 6L7 1.5 12.5 6V13H9V9H5v4H1.5V6z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            Home
          </button>
          <div className="sb-divider" style={{ margin: '6px 10px 4px' }} />

          {/* Groups from menuData */}
          {menuData.groups.map(renderGroup)}
        </div>

        <div className="sb-divider" />
        <div className="sb-bottom">
          <div className="sb-user" onClick={() => navigate('/profile')}>
            <div className="sb-avatar">{initials}</div>
            <div>
              <div className="sb-user-name">{user?.name}</div>
              <div className="sb-user-role">{user?.role} · {user?.tenant}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="content-area">
        <div className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="hamburger-btn" onClick={() => setDrawerOpen(v => !v)} title="Menu">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <div className="top-breadcrumb">
              {BREADCRUMBS[location.pathname] ?? <b>{location.pathname}</b>}
            </div>
          </div>
          <div className="top-right">
            <div className="top-badge">Anno 2026</div>
            <div className="top-badge">Stab. {user?.tenant ?? 'MVN'}</div>
            <div style={{ width: 1, height: 20, background: '#D9E4EF', margin: '0 2px' }} />
            <button className="top-notif" title="Notifiche">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4v2l1 2H2l1-2V5a4 4 0 0 1 4-4z" stroke="#5a7a99" strokeWidth="1.3" /><path d="M5.5 11a1.5 1.5 0 0 0 3 0" stroke="#5a7a99" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>

            {/* User button */}
            <button className="usr-btn" ref={btnRef} onClick={() => setDropdownOpen(v => !v)}>
              <div className="usr-av">{initials}</div>
              <div className="usr-info">
                <div className="usr-name">{user?.name}</div>
                <div className="usr-role">{user?.role}</div>
              </div>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, color: '#8aA8C0' }}><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* User dropdown */}
        {dropdownOpen && (
          <div className="usr-dropdown" ref={dropdownRef}>
            <div className="usr-drop-hd">
              <div className="usr-drop-av">{initials}</div>
              <div>
                <div className="usr-drop-name">{user?.name}</div>
                <div className="usr-drop-role">{user?.role} · {user?.tenant}</div>
                <div className="usr-drop-env"><span className="env-dot-green" /> Produzione</div>
              </div>
            </div>
            <div className="usr-drop-divider" />
            <button className="usr-drop-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M1.5 13c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              Il mio profilo
            </button>
            <button className="usr-drop-item" onClick={() => setDropdownOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M7 1.5V3M7 11v1.5M1.5 7H3M11 7h1.5M3.1 3.1l1.1 1.1M9.8 9.8l1.1 1.1M9.8 3.1l-1.1 1.1M3.1 9.8l1.1 1.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              Impostazioni
            </button>
            <div className="usr-drop-divider" />
            <button className="usr-drop-item usr-drop-logout" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 10l3-3-3-3M12 7H5M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Esci (Logout)
            </button>
          </div>
        )}

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
