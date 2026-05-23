// Job review screen — /app/jobs/[id]
// Status badge + step polling + video preview + meta + retry / publish.

const STEP_LABELS = {
  script:   '대본 쓰는 중…',
  tts:      '목소리 입히는 중…',
  visual:   '이미지 만드는 중…',
  captions: '자막 맞추는 중…',
  render:   '영상 만드는 중…',
};
const STEP_ORDER = ['script', 'tts', 'visual', 'captions', 'render'];

const TEMPLATE_KO = { documentary: '기본형', pop: '팝형', banner: '배너형' };
const TEMPLATE_SVG = {
  documentary: '../../assets/templates/documentary.svg',
  pop:         '../../assets/templates/pop.svg',
  banner:      '../../assets/templates/banner.svg',
};

function Job({ jobId, onBack, onRoute }) {
  const [job, setJob] = React.useState(() => window.DullizzeAPI.getJob(jobId));
  const [published, setPub] = React.useState(false);

  React.useEffect(() => {
    if (!job) return;
    if (job.status === 'queued' || job.status === 'running') {
      window.DullizzeAPI.startPolling(job.job_id, (next) => setJob({ ...next }));
    }
    return () => window.DullizzeAPI.stopPolling(jobId);
  }, [jobId]);

  if (!job) {
    return (
      <Card padding={28} style={{ textAlign: 'center' }}>
        <p>찾을 수 없는 작업이에요.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <Button onClick={onBack} icon="arrowLeft">대시보드로</Button>
        </div>
      </Card>
    );
  }

  const isRunning = job.status === 'queued' || job.status === 'running';
  const isFailed  = job.status === 'failed';
  const isDone    = job.status === 'done';

  const stepIdx = STEP_ORDER.indexOf(job.step);
  const progress = isDone ? 100 : Math.round(((stepIdx + (isRunning ? 0.4 : 0)) / STEP_ORDER.length) * 100);

  function retry() {
    job.status = 'queued'; job.error = null; job.step = 'script';
    setJob({ ...job });
    window.DullizzeAPI.startPolling(job.job_id, (next) => setJob({ ...next }));
  }

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg-muted)' }}>
        <a onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
          <Icon name="arrowLeft" size={14} /> 대시보드
        </a>
        <Icon name="chevronRight" size={12} />
        <span style={{ font: '500 12px/1 var(--font-mono)', color: 'var(--fg-muted)' }}>{job.job_id}</span>
      </div>

      {/* header */}
      <Card padding={22}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'start' }}>
          <div>
            <h1 style={{ font: '700 22px/1.3 var(--font-display)', letterSpacing: '-0.01em', margin: 0 }}>
              {job.topic}
            </h1>
            <div style={{ marginTop: 8, color: 'var(--fg-muted)', fontSize: 13, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span>{TEMPLATE_KO[job.template]}</span>
              <span>·</span>
              <span>{job.voice || '기본 보이스'}</span>
              <span>·</span>
              <span>{job.visual_mode === 'motion_image' ? '빠른 모드' : job.visual_mode}</span>
              <span>·</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>업데이트 {job.updated_at}</span>
            </div>
          </div>
          <Badge status={job.status} pulse={isRunning}>
            {job.status.toUpperCase()} · {STATUS_KO[job.status] || ''}
          </Badge>
        </div>
      </Card>

      {/* two-pane preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: 18, alignItems: 'start' }}>

        {/* video pane */}
        <div style={{ background: '#111827', borderRadius: 8, padding: 18 }}>
          <div style={{
            position: 'relative', aspectRatio: '9 / 16', borderRadius: 6, overflow: 'hidden',
            background: '#0b111d', display: 'grid', placeItems: 'center',
          }}>
            <img src={TEMPLATE_SVG[job.template]} alt=""
                 style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: isDone ? 1 : 0.4 }} />
            {!isDone ? (
              <div style={{ position: 'relative', zIndex: 1, color: '#cbd5e1', textAlign: 'center', font: '500 12px/1.4 var(--font-mono)' }}>
                {isFailed ? (
                  <React.Fragment>
                    <div style={{ color: '#f87171', marginBottom: 6 }}>● 실패</div>
                    final.mp4 — 미생성
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div style={{ color: '#fff', marginBottom: 6, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 }}>
                      {STEP_LABELS[job.step] || '준비 중…'}
                    </div>
                    final.mp4 — 만드는 중
                  </React.Fragment>
                )}
              </div>
            ) : (
              <button
                style={{
                  position: 'relative', zIndex: 1, width: 56, height: 56, borderRadius: '50%',
                  border: 0, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.92)', color: '#0b111d',
                  display: 'grid', placeItems: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
                }}
                onClick={() => alert('재생 (placeholder)')}>
                <Icon name="play" size={22} strokeWidth={2.25} />
              </button>
            )}
          </div>

          {isDone ? (
            <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
              {!published ? (
                <Button variant="primary" icon="upload" onClick={() => setPub(true)}>YouTube에 공개</Button>
              ) : (
                <Button variant="secondary" icon="check" disabled>공개 완료 · 비공개로 전환</Button>
              )}
              <Button variant="secondary" icon="eye" onClick={() => alert('새 탭에서 비공개 영상 미리보기 (placeholder)')}>
                비공개 영상 미리보기
              </Button>
            </div>
          ) : isFailed ? (
            <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
              <Button variant="primary" icon="refresh" onClick={retry}>다시 시도</Button>
            </div>
          ) : null}
        </div>

        {/* right: steps + meta */}
        <div style={{ display: 'grid', gap: 18 }}>
          <Card title={isDone ? '완료' : isFailed ? '실패' : '진행 상태'} padding={18}
                action={isRunning ? <span style={{ font: '500 12px/1 var(--font-mono)', color: 'var(--fg-muted)' }}>{progress}%</span> : null}>
            {/* progress bar */}
            <div style={{
              height: 6, borderRadius: 999, background: 'var(--surface-soft)', overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{
                width: `${progress}%`, height: '100%',
                background: isFailed ? 'var(--danger)' : 'var(--accent)',
                transition: 'width 280ms cubic-bezier(0.16,1,0.30,1)',
              }} />
            </div>

            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid' }}>
              {STEP_ORDER.map((key, i) => {
                const past = i < stepIdx || isDone;
                const current = i === stepIdx && isRunning;
                const pending = i > stepIdx && !isDone;
                const failed = isFailed && i === stepIdx;
                return (
                  <li key={key} style={{
                    display: 'grid', gridTemplateColumns: '28px 1fr auto',
                    gap: 12, alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < STEP_ORDER.length - 1 ? '1px solid var(--line-soft)' : 0,
                    fontSize: 14,
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      display: 'grid', placeItems: 'center',
                      border: '2px solid', fontWeight: 700, fontSize: 11,
                      borderColor: past ? 'var(--accent)' : current ? 'var(--warning)' : failed ? 'var(--danger)' : 'var(--line)',
                      background:   past ? 'var(--accent)' : 'transparent',
                      color:        past ? '#fff' : current ? 'var(--warning)' : failed ? 'var(--danger)' : 'var(--fg-muted)',
                      animation: current ? 'dlz-spin 1.6s linear infinite' : 'none',
                    }}>
                      {past ? <Icon name="check" size={11} strokeWidth={3} /> : (failed ? '!' : i + 1)}
                    </span>
                    <span style={{
                      color: past || current ? 'var(--fg)' : 'var(--fg-muted)',
                      fontWeight: current ? 600 : 400,
                    }}>{STEP_LABELS[key]}</span>
                    <span style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--fg-muted)' }}>
                      {past ? '완료' : current ? '진행 중' : failed ? '오류' : '대기'}
                    </span>
                  </li>
                );
              })}
            </ol>

            {isFailed ? (
              <div style={{
                marginTop: 16, padding: '12px 14px', borderRadius: 8,
                background: 'var(--danger-soft)', border: '1px solid var(--danger-line)',
                color: 'var(--danger)', fontSize: 13, lineHeight: 1.5,
                display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10,
              }}>
                <Icon name="alert" size={16} />
                <div>
                  <b>{STEP_LABELS[job.step]?.replace('…', '')}에서 멈췄어요.</b><br/>
                  {job.error?.message}
                </div>
              </div>
            ) : null}
          </Card>

          <Card title="작업 정보" padding={18}>
            {[
              ['Step',     job.step],
              ['User',     `${job.user_id} · ${job.plan}`],
              ['Quota',    `${job.quota.used} / ${job.quota.limit} · ${job.quota.remaining}편 남음`],
              ['Visual',   `${job.visual_mode} / ${job.visual_provider}`],
              ['Template', TEMPLATE_KO[job.template]],
              ['Updated',  job.updated_at],
              ['Run dir',  job.run_dir],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: 'grid', gridTemplateColumns: '92px 1fr',
                gap: 10, padding: '9px 0',
                borderBottom: '1px solid var(--line-soft)', fontSize: 13,
              }}>
                <span style={{ color: 'var(--fg-muted)', fontWeight: 600 }}>{k}</span>
                <span style={{ font: 'var(--font-mono)', fontSize: 12, color: 'var(--fg)', wordBreak: 'break-all' }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Job });
