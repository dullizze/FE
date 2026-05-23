// Dashboard — /app/dashboard
// Quota card + job list with thumbnails + filters + retry / open.

const STATUS_FILTERS = [
  { value: 'all',    label: '전체' },
  { value: 'done',   label: '완료' },
  { value: 'running',label: '진행 중' },
  { value: 'failed', label: '실패' },
];
const DBTEMPLATE_KO = { documentary: '기본형', pop: '팝형', banner: '배너형' };
const DBTEMPLATE_SVG = {
  documentary: '../../assets/templates/documentary.svg',
  pop:         '../../assets/templates/pop.svg',
  banner:      '../../assets/templates/banner.svg',
};

function Dashboard({ onOpenJob, onCreate }) {
  const [filter, setFilter] = React.useState('all');
  const [jobs, setJobs] = React.useState(() => window.DullizzeAPI.listJobs());
  const [quota, setQuota] = React.useState(() => window.DullizzeAPI.getQuota());

  React.useEffect(() => {
    const sync = async () => {
      await window.DullizzeAPI.refreshJobs?.();
      setJobs(window.DullizzeAPI.listJobs());
      setQuota(window.DullizzeAPI.getQuota());
    };
    sync();
    const off = window.DullizzeAPI.onChange?.(() => {
      setJobs(window.DullizzeAPI.listJobs());
      setQuota(window.DullizzeAPI.getQuota());
    });
    const t = setInterval(sync, 2500);
    return () => {
      off?.();
      clearInterval(t);
    };
  }, []);

  const filtered = jobs.filter((j) => {
    if (filter === 'all') return true;
    if (filter === 'running') return j.status === 'queued' || j.status === 'running';
    return j.status === filter;
  });

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* heading */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ font: '700 26px/1.2 var(--font-display)', letterSpacing: '-0.012em', margin: 0 }}>대시보드</h1>
          <p style={{ color: 'var(--fg-muted)', margin: '4px 0 0', fontSize: 14 }}>
            지금까지 만든 영상과 이번 달 사용량을 한 눈에 볼 수 있어요.
          </p>
        </div>
        <Button variant="primary" icon="plus" onClick={onCreate}>새 쇼츠 만들기</Button>
      </div>

      {/* quota row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        <Card padding={20} style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 600 }}>이번 달 사용량</div>
              <div style={{ font: '700 28px/1.1 var(--font-display)', marginTop: 4, whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--accent)' }}>{quota.used}</span>
                <span style={{ color: 'var(--fg-subtle)', fontWeight: 500, fontSize: 18 }}> / {quota.limit}편</span>
              </div>
            </div>
            <Badge status="done">{quota.plan.toUpperCase()} 플랜</Badge>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-soft)', marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${(quota.used / quota.limit) * 100}%`, height: '100%', background: 'var(--accent)' }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
            {quota.remaining}편 더 만들 수 있어요. 매월 1일에 초기화돼요.
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 600 }}>채널 연결</div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#ff4242,#ff7676)',
              display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 13,
            }}>YT</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>소소한 AI 입문노트</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>연결됨 · 비공개 업로드</div>
            </div>
          </div>
        </Card>
      </div>

      {/* filter row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4, padding: 4, border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface-soft)' }}>
          {STATUS_FILTERS.map((f) => (
            <button key={f.value} type="button" onClick={() => setFilter(f.value)}
              style={{
                height: 30, padding: '0 12px', borderRadius: 6, border: 0, cursor: 'pointer',
                font: '600 13px/1 var(--font-body)',
                background: filter === f.value ? '#fff' : 'transparent',
                color: filter === f.value ? 'var(--accent-hover)' : 'var(--fg-muted)',
                boxShadow: filter === f.value ? 'var(--shadow-sm)' : 'none',
              }}>{f.label}</button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{filtered.length}개</div>
      </div>

      {/* job grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
        {filtered.map((j) => (
          <article key={j.job_id} onClick={() => onOpenJob(j.job_id)}
            style={{
              background: '#fff', border: '1px solid var(--line)', borderRadius: 8,
              cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column',
              transition: 'box-shadow 180ms, transform 180ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ position: 'relative', aspectRatio: '9 / 16', background: '#111827' }}>
              <img src={DBTEMPLATE_SVG[j.template]} alt=""
                   style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                            opacity: j.status === 'done' ? 1 : 0.45 }} />
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                <Badge status={j.status} pulse={j.status === 'running' || j.status === 'queued'}>
                  {STATUS_KO[j.status]}
                </Badge>
              </div>
              {j.status === 'done' ? (
                <div style={{
                  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.92)', color: '#0b111d',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <Icon name="play" size={16} strokeWidth={2.25} />
                  </div>
                </div>
              ) : null}
            </div>
            <div style={{ padding: 14, display: 'grid', gap: 6 }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, color: 'var(--fg)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {j.topic}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>{DBTEMPLATE_KO[j.template]}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{j.updated_at.slice(5)}</span>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1', textAlign: 'center', padding: 48,
            border: '1px dashed var(--line)', borderRadius: 8, color: 'var(--fg-muted)',
          }}>
            <Icon name="sparkles" size={28} />
            <p style={{ margin: '10px 0 14px' }}>아직 만든 영상이 없어요.</p>
            <Button variant="primary" icon="plus" onClick={onCreate}>첫 쇼츠 만들기</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
