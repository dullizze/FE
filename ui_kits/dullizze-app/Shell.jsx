// Shell — header (brand + nav + API status + quota chip + avatar) and
// the main layout container.

const NAV = [
  { id: 'create',    label: '만들기',    icon: 'sparkles' },
  { id: 'dashboard', label: '대시보드',  icon: 'layoutGrid' },
  { id: 'presets',   label: '프리셋',    icon: 'bookmark' },
  { id: 'settings',  label: '설정',      icon: 'settings' },
];

function Shell({ route, onRoute, children }) {
  const [quota, setQuota] = React.useState(() => window.DullizzeAPI.getQuota());
  const [apiStatus, setApiStatus] = React.useState(() => window.DullizzeAPI.getStatus?.() || { connected: true, text: 'API · 목업' });

  React.useEffect(() => {
    const sync = () => {
      setQuota(window.DullizzeAPI.getQuota());
      setApiStatus(window.DullizzeAPI.getStatus?.() || { connected: true, text: 'API · 목업' });
    };
    const off = window.DullizzeAPI.onChange?.(sync);
    window.DullizzeAPI.refreshHealth?.();
    window.DullizzeAPI.refreshQuota?.().then(sync).catch(sync);
    const timer = setInterval(sync, 2500);
    return () => {
      off?.();
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 24,
        height: 58, padding: '0 24px', minWidth: 0,
        background: '#fff', borderBottom: '1px solid var(--line)',
      }}>
        <a onClick={() => onRoute({ name: 'create' })}
           style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <img src="../../assets/dullizze-mark.svg" width="26" height="26" alt="" />
          <span style={{ font: '700 17px/1 var(--font-display)', letterSpacing: '-0.01em', color: 'var(--fg)' }}>
            Dullizze
          </span>
        </a>

        <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
          {NAV.map((n) => {
            const active = route.name === n.id || (n.id === 'create' && route.name === 'job');
            return (
              <a key={n.id} onClick={() => onRoute({ name: n.id })}
                 style={{
                   display: 'inline-flex', alignItems: 'center', gap: 6,
                   padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
                   fontSize: 14, fontWeight: 600,
                   color: active ? 'var(--fg)' : 'var(--fg-muted)',
                   background: active ? 'var(--surface-soft)' : 'transparent',
                 }}>
                <Icon name={n.icon} size={16} />
                {n.label}
                {n.id === 'settings' ? null : null}
              </a>
            );
          })}
          <a onClick={() => alert('Phase 2 — per-cut editor 준비 중')}
             style={{
               display: 'inline-flex', alignItems: 'center', gap: 6,
               padding: '7px 12px', borderRadius: 6, cursor: 'pointer',
               fontSize: 14, fontWeight: 600, color: 'var(--fg-subtle)',
             }}>
            <Icon name="video" size={16} />
            에디터
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 9999,
              background: 'var(--surface-soft)', color: 'var(--fg-muted)',
              letterSpacing: '0.04em',
            }}>준비중</span>
          </a>
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-muted)', font: '500 12px/1 var(--font-mono)', whiteSpace: 'nowrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: apiStatus.connected ? 'var(--success)' : 'var(--warning)' }} />
            {apiStatus.text}
          </span>
          <Quota used={quota.used} limit={quota.limit} />
          <span style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--w-blue-95), var(--w-violet-50))',
            display: 'grid', placeItems: 'center',
            font: '700 12px/1 var(--font-body)', color: 'var(--fg-on-brand)',
          }}>소</span>
        </div>
      </header>

      <main style={{ padding: '24px 24px 64px', maxWidth: 1280, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}

Object.assign(window, { Shell });
