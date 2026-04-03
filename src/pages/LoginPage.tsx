import { useState, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './LoginPage.css';

const ENVS = ['Produzione', 'Staging', 'Dev / Test'] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  const [activeEnv, setActiveEnv] = useState(0);
  const [facility, setFacility] = useState('MVN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function shake() {
    const el = cardRef.current;
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 450);
  }

  function showError(msg: string) {
    setSuccess('');
    setError(msg);
    shake();
  }

  async function handleLogin(e?: FormEvent) {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) { showError('Inserisci il tuo username.'); return; }
    if (!password) { showError('Inserisci la password.'); return; }

    setLoading(true);
    try {
      const data = await login(username.trim(), password);
      setSuccess(`Benvenuto/a ${data.name}! Caricamento WMS...`);

      setTimeout(() => {
        if (data.forcePasswordChange) {
          navigate('/change-password', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }, 800);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Username o password non corretti.';
      showError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSSO() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showError(`SSO non configurato per ambiente: ${ENVS[activeEnv]}.`);
    }, 1100);
  }

  function handleForgot() {
    if (username.trim()) {
      setError('');
      setSuccess(`Email di reset inviata a ${username.trim()}@mvnlog.com`);
    } else {
      showError('Inserisci prima lo username per il reset.');
    }
  }

  return (
    <div className="login-root">
      {/* ── Left branding panel ── */}
      <div className="l-panel">
        <div className="l-logo">
          <div className="l-logo-title">MVN WMS</div>
          <div className="l-logo-sub">Warehouse Management System</div>
        </div>

        <div className="l-content">
          <div className="l-headline">
            Gestisci il tuo<br />magazzino con <span>precisione</span>
          </div>
          <div className="l-desc">
            Piattaforma WMS modulare per inbound, outbound e warehouse flow.
            Interfacciabile con qualsiasi ERP e adattabile a ogni tipologia di magazzino.
          </div>

          <div className="l-features">
            <div className="l-feat">
              <div className="l-feat-ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M8 2l6 6-6 6" stroke="#5DC8A0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="l-feat-lbl"><b>Inbound &amp; Outbound Flow</b> — accettazione, picking, spedizioni</div>
            </div>
            <div className="l-feat">
              <div className="l-feat-ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 6.5L8 2l7 4.5V15H1V6.5z" stroke="#5DC8A0" strokeWidth="1.5" strokeLinejoin="round" />
                  <rect x="5" y="10" width="6" height="5" rx=".5" stroke="#5DC8A0" strokeWidth="1.4" />
                </svg>
              </div>
              <div className="l-feat-lbl"><b>Global MDM</b> — articoli, soggetti, foreste GPC GS1</div>
            </div>
            <div className="l-feat">
              <div className="l-feat-ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="1" width="10" height="14" rx="2" stroke="#5DC8A0" strokeWidth="1.5" />
                  <path d="M6 5h4M6 8h4M6 11h2" stroke="#5DC8A0" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="l-feat-lbl"><b>HH &amp; Voice picking</b> — terminali portatili integrati</div>
            </div>
            <div className="l-feat">
              <div className="l-feat-ico">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5 8a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" stroke="#5DC8A0" strokeWidth="1.4" />
                  <path d="M2 4l2 2M12 4l-2 2M2 12l2-2M12 12l-2-2M8 1v2M8 13v2M1 8h2M13 8h2" stroke="#5DC8A0" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="l-feat-lbl"><b>Integrazioni ERP</b> — SAP, Oracle, Microsoft e custom</div>
            </div>
          </div>
        </div>

        <div className="l-footer">MVN WMS &nbsp;&bull;&nbsp; Powered by ONIT On.Plant &nbsp;&bull;&nbsp; v5.0.1</div>
      </div>

      {/* ── Right login panel ── */}
      <div className="r-panel">
        <div className="r-panel-top" />
        <div className="r-card" ref={cardRef}>
          <div className="r-title">Accedi al WMS</div>
          <div className="r-sub">Inserisci le credenziali del tuo account aziendale</div>

          {/* Environment selector */}
          <div className="env-row">
            {ENVS.map((label, i) => (
              <div
                key={label}
                className={`env-chip${i === activeEnv ? ' active' : ''}`}
                onClick={() => setActiveEnv(i)}
              >
                <span className="env-dot" />{label}
              </div>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div className="err-box">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#A32D2D" strokeWidth="1.4" />
                <path d="M7 4v4M7 10v.5" stroke="#A32D2D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="ok-box">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#27500A" strokeWidth="1.4" />
                <path d="M4 7l2.5 2.5 4-4" stroke="#27500A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Facility */}
            <div className="fg">
              <div className="fl">Stabilimento</div>
              <select className="co-sel" value={facility} onChange={(e) => setFacility(e.target.value)}>
                <option value="MVN">(1) MVN — Magazzino Principale</option>
                <option value="BLG">(2) BLG — Bologna</option>
                <option value="ROM">(3) ROM — Roma</option>
              </select>
            </div>

            {/* Username */}
            <div className="fg">
              <div className="fl">Username</div>
              <div className="fi-wrap">
                <span className="fi-ico">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1.5 13c0-3.04 2.46-5.5 5.5-5.5s5.5 2.46 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  className="fi has-ico"
                  type="text"
                  placeholder="es. itripodi"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="fg" style={{ marginBottom: 10 }}>
              <div className="fl">Password</div>
              <div className="fi-wrap">
                <span className="fi-ico">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="6.5" width="10" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M5 6.5V4.5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  className="fi has-ico"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                />
                <button className="fi-eye" type="button" onClick={() => setShowPw(!showPw)} title="Mostra/nascondi">
                  {showPw ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2l10 10M1 7c1.5-3 3.5-4.5 6-4.5m4.5 1.5C12.5 5.5 11 4 9.5 3.2M10.5 9.5C9.5 10.8 8.3 11.5 7 11.5c-2.5 0-4.5-1.5-6-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7c1.5-3 3.5-4.5 6-4.5S11.5 4 13 7c-1.5 3-3.5 4.5-6 4.5S2.5 10 1 7z" stroke="currentColor" strokeWidth="1.3" />
                      <circle cx="7" cy="7" r="1.8" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="rf-row">
              <label className="rf-check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Ricordami
              </label>
              <button className="rf-link" type="button" onClick={handleForgot}>Password dimenticata?</button>
            </div>

            {/* Login button */}
            <button
              className={`btn-login${loading ? ' loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Accedi
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* SSO */}
          <div className="divider">oppure</div>
          <button className="btn-sso" type="button" onClick={handleSSO}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="#0C3A6B" opacity=".8" />
              <rect x="8" y="1" width="6" height="6" rx="1" fill="#2A7BE4" opacity=".8" />
              <rect x="1" y="8" width="6" height="6" rx="1" fill="#5DC8A0" opacity=".8" />
              <rect x="8" y="8" width="6" height="6" rx="1" fill="#0C3A6B" opacity=".4" />
            </svg>
            Accedi con SSO aziendale
          </button>

          {/* Demo hint */}
          <div className="demo-hint">
            <strong>Demo:</strong> usa <code>glipari</code> / <code>admin123</code> &nbsp;&bull;&nbsp; <code>admin</code> / <code>admin</code>
          </div>
        </div>

        <div className="r-footer">
          &copy; 2026 MVN Logistics &nbsp;&bull;&nbsp; v5.0.1 &nbsp;&bull;&nbsp;
          <a href="#">Privacy</a> &nbsp;&bull;&nbsp;
          <a href="#">Supporto</a>
        </div>
      </div>
    </div>
  );
}
