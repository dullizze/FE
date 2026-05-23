// Primitives — Button, Input, Textarea, Select, Field, Segmented, Badge,
// Card, Quota chip. Style objects are NAMED (no global `styles`).

const pButton = {
  base: {
    height: 40, padding: '0 16px', borderRadius: 6,
    font: '600 14px/1 var(--font-body)',
    cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, border: '1px solid transparent',
    transition: 'background 120ms cubic-bezier(0.16,1,0.30,1), border-color 120ms',
    whiteSpace: 'nowrap',
  },
  primary:   { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
  secondary: { background: '#fff', color: 'var(--fg)', borderColor: 'var(--line)' },
  ghost:     { background: 'transparent', color: 'var(--fg)' },
  danger:    { background: '#fff', color: 'var(--danger)', borderColor: 'var(--danger-line)' },
  small:     { height: 32, padding: '0 12px', fontSize: 13 },
};

function Button({ variant = 'secondary', size, disabled, icon, children, onClick, style, type = 'button' }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  let s = { ...pButton.base, ...pButton[variant] };
  if (size === 'sm') s = { ...s, ...pButton.small };
  if (hover && !disabled) {
    if (variant === 'primary')   s.background = 'var(--accent-hover)';
    if (variant === 'secondary') s.background = 'var(--surface-soft)';
    if (variant === 'ghost')     s.background = 'var(--surface-soft)';
    if (variant === 'danger')    s.background = 'var(--danger-soft)';
  }
  if (press && !disabled && variant === 'primary') s.background = 'var(--w-blue-30)';
  if (disabled) { s.opacity = 0.58; s.cursor = 'not-allowed'; }
  return (
    <button type={type} onClick={disabled ? undefined : onClick}
      style={{ ...s, ...style }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}>
      {icon ? <Icon name={icon} size={16} /> : null}
      {children}
    </button>
  );
}

const inputBase = {
  width: '100%', border: '1px solid var(--line)', borderRadius: 6,
  background: '#fff', color: 'var(--fg)',
  font: '400 14px/1.4 var(--font-body)', outline: 'none',
  transition: 'border-color 120ms, box-shadow 120ms',
};

function Input({ value, onChange, placeholder, type = 'text', style, autoFocus }) {
  const [focus, setFocus] = React.useState(false);
  const s = { ...inputBase, height: 40, padding: '0 12px',
    ...(focus ? { borderColor: 'var(--accent)', boxShadow: 'var(--shadow-ring)' } : {}),
    ...style };
  return <input type={type} value={value ?? ''} placeholder={placeholder} autoFocus={autoFocus}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={s} />;
}

function Textarea({ value, onChange, placeholder, rows = 4, style }) {
  const [focus, setFocus] = React.useState(false);
  const s = { ...inputBase, padding: '10px 12px', lineHeight: 1.55, resize: 'vertical',
    minHeight: rows * 22 + 20,
    ...(focus ? { borderColor: 'var(--accent)', boxShadow: 'var(--shadow-ring)' } : {}),
    ...style };
  return <textarea value={value ?? ''} placeholder={placeholder}
                   onChange={(e) => onChange?.(e.target.value)}
                   onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={s} />;
}

function Select({ value, onChange, options, style }) {
  const [focus, setFocus] = React.useState(false);
  const s = { ...inputBase, height: 40, padding: '0 36px 0 12px',
    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
    backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23647078' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\")",
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    ...(focus ? { borderColor: 'var(--accent)', boxShadow: 'var(--shadow-ring)' } : {}),
    ...style };
  return (
    <select value={value} onChange={(e) => onChange?.(e.target.value)}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={s}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'block' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)', marginBottom: 6 }}>
        {label} {hint ? <span style={{ fontWeight: 400, color: 'var(--fg-subtle)' }}>· {hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div role="group" style={{
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      gap: 6, padding: 4, border: '1px solid var(--line)', borderRadius: 8,
      background: 'var(--surface-soft)',
    }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button key={o.value} type="button" onClick={() => onChange?.(o.value)}
            style={{
              height: 36, border: 0, borderRadius: 6, cursor: 'pointer',
              font: '600 14px/1 var(--font-body)',
              background: active ? '#fff' : 'transparent',
              color: active ? 'var(--accent-hover)' : 'var(--fg-muted)',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 120ms',
            }}>
            {o.icon ? <Icon name={o.icon} size={15} /> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const COLOR_SWATCHES = [
  '#000000', '#303030', '#5C5C5C', '#8A8A8A', '#B0B0B0', '#DCDCDC', '#F4F4F5', '#FFFFFF',
  '#B20C0C', '#E52222', '#FF9200', '#FFE000', '#49E57D', '#73E3E3', '#4F95FF', '#6541F2',
  '#D331B8', '#FF4FA3', '#D6B1A5', '#F0C7BD', '#FEE6C6', '#FEF4E6', '#D9FFE6', '#EAF2FE',
  '#C9DEFE', '#DBDCDF', '#D8CCE3', '#E5C8D7', '#C35F45', '#D98774', '#EAC592', '#F7D86D',
  '#A8C686', '#93B6B8', '#9EC5FF', '#8AA1D9', '#9B78C7', '#B17EA3', '#9C3E24', '#C75943',
  '#D99036', '#D7AA29', '#76A84F', '#4C7A89', '#4375DB', '#4F5DBB', '#6D3B92', '#914B78',
  '#6B1B0B', '#84220D', '#8F5213', '#917114', '#315B1E', '#153A4A', '#1D4094', '#2B236E',
  '#4C165D', '#5A123B',
];

function normalizeHexColor(value) {
  const raw = String(value || '').trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw}`.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toUpperCase();
  }
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toUpperCase();
  }
  return raw;
}

function ColorPalette({ value, onChange, colors = COLOR_SWATCHES }) {
  const selected = normalizeHexColor(value);
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div role="grid" aria-label="글씨 강조색" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))',
        justifyItems: 'center',
        gap: 8,
        padding: 10,
        border: '1px solid var(--line)',
        borderRadius: 8,
        background: 'var(--surface-soft)',
      }}>
        {colors.map((color) => {
          const normalized = normalizeHexColor(color);
          const active = normalized === selected;
          const isLight = ['#FFFFFF', '#F4F4F5', '#DCDCDC', '#FEF4E6', '#FEE6C6', '#D9FFE6', '#EAF2FE', '#C9DEFE', '#DBDCDF', '#D8CCE3', '#E5C8D7'].includes(normalized);
          return (
            <button key={normalized} type="button" title={normalized} aria-label={normalized}
              onClick={() => onChange?.(normalized)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: active ? '2px solid var(--fg)' : '1px solid rgba(0,0,0,0.16)',
                background: normalized,
                boxShadow: active ? '0 0 0 3px var(--accent-ring)' : 'none',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                padding: 0,
              }}>
              {active ? (
                <Icon name="check" size={16} strokeWidth={2.5}
                      style={{ color: isLight ? 'var(--fg)' : '#fff' }} />
              ) : null}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 10, alignItems: 'center' }}>
        <span style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: selected || 'transparent',
          border: '1px solid var(--line)',
        }} />
        <Input value={value} onChange={(next) => onChange?.(normalizeHexColor(next))}
               placeholder="#FF4FA3" />
      </div>
    </div>
  );
}

const badgeMap = {
  idle:    { c: 'var(--fg-muted)', bg: 'var(--surface)',      bd: 'var(--line)' },
  queued:  { c: 'var(--warning)',  bg: 'var(--warning-soft)', bd: 'var(--warning-line)' },
  running: { c: 'var(--warning)',  bg: 'var(--warning-soft)', bd: 'var(--warning-line)' },
  done:    { c: 'var(--success)',  bg: 'var(--success-soft)', bd: 'var(--success-line)' },
  failed:  { c: 'var(--danger)',   bg: 'var(--danger-soft)',  bd: 'var(--danger-line)' },
};
const STATUS_KO = { idle: '대기', queued: '예약', running: '생성중', done: '완료', failed: '실패' };

function Badge({ status = 'idle', children, pulse }) {
  const t = badgeMap[status] || badgeMap.idle;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px',
      minHeight: 28, borderRadius: 9999, border: `1px solid ${t.bd}`,
      background: t.bg, color: t.c, fontSize: 12, fontWeight: 700,
      letterSpacing: '0.02em',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%', background: 'currentColor',
        animation: pulse ? 'dlz-pulse 1.2s ease-in-out infinite' : 'none',
      }} />
      {children ?? `${status.toUpperCase()} · ${STATUS_KO[status]}`}
    </span>
  );
}

function Card({ title, action, children, style, padding = 18 }) {
  return (
    <section style={{
      background: '#fff', border: '1px solid var(--line)',
      borderRadius: 8, ...style,
    }}>
      {title || action ? (
        <header style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: `${padding}px ${padding}px ${title && children ? 0 : padding}px`,
        }}>
          {title ? <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h2> : <span />}
          {action}
        </header>
      ) : null}
      {children ? <div style={{ padding }}>{children}</div> : null}
    </section>
  );
}

function Quota({ used, limit }) {
  const remaining = Math.max(0, limit - used);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 28, padding: '0 12px', borderRadius: 9999,
      background: 'var(--accent-soft)', color: 'var(--accent-hover)',
      fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <Icon name="sparkles" size={13} />
      이번 달 {remaining}편 남음
    </span>
  );
}

Object.assign(window, { Button, Input, Textarea, Select, Field, Segmented, ColorPalette, Badge, Card, Quota, STATUS_KO });
