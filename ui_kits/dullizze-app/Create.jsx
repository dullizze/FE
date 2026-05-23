// Create screen — /app/create
// Topic + 형(template) + smart-defaults + collapsible 고급 설정

const TEMPLATES = [
  { value: 'documentary', label: '기본형', icon: '../../assets/templates/documentary.svg',
    blurb: '어두운 시네마틱 + 흰 글자 + 검정 외곽선. 정보/지식 영상에 안정적.' },
  { value: 'pop',         label: '팝형',   icon: '../../assets/templates/pop.svg',
    blurb: '노란 자막 박스 + 상단 진행바. 잡지식·팁 영상에 어울려요.' },
  { value: 'banner',      label: '배너형', icon: '../../assets/templates/banner.svg',
    blurb: '위·아래 검은 띠에 헤드라인. 후크가 강한 영상에 추천.' },
];

const VOICES = [
  { value: 'ko-KR-SunHiNeural',   label: '선희 (여성, 차분)' },
  { value: 'ko-KR-InJoonNeural',  label: '인준 (남성, 또렷)' },
  { value: 'ko-KR-JiMinNeural',   label: '지민 (여성, 밝음)' },
];
const VISUAL_MODES = [
  { value: 'motion_image', label: '빠른 모드 · 이미지 + 카메라무브' },
  { value: 'stock_video',  label: '자료영상 모드 · Pexels/Pixabay' },
  { value: 'ai_video',     label: 'AI 영상 모드 · Pro 전용 · 크레딧 차감' },
  { value: 'auto',         label: '자동 (스마트 기본값)' },
];

function Create({ onCreated }) {
  const [topic, setTopic]     = React.useState('클레오파트라는 이집트인이 아니었다');
  const [template, setTpl]    = React.useState('documentary');
  const [tone, setTone]       = React.useState('흥미로운_사실');
  const [voice, setVoice]     = React.useState('ko-KR-SunHiNeural');
  const [visualMode, setVM]   = React.useState('motion_image');
  const [advanced, setAdv]    = React.useState(false);
  const [submitting, setSub]  = React.useState(false);

  // banner-only branding fields
  const [headlineMain, setHM]     = React.useState('');
  const [headlineAccent, setHA]   = React.useState('');
  const [channelName, setCN]      = React.useState('');
  const [accentColor, setAC]      = React.useState('#ff4fa3');

  const tpl = TEMPLATES.find((t) => t.value === template);
  const charsLeft = 200 - topic.length;

  async function submit(e) {
    e?.preventDefault?.();
    if (!topic.trim() || submitting) return;
    setSub(true);
    try {
      const job = await window.DullizzeAPI.createJob({
        topic: topic.trim(), template, tone, voice,
        visual_mode: visualMode, headline_main: headlineMain || null,
        headline_accent: headlineAccent || null, channel_name: channelName || null,
        accent_color: accentColor,
      });
      window.DullizzeAPI.startPolling(job.job_id, () => {});
      onCreated(job.job_id);
    } catch (err) {
      alert(`생성 요청에 실패했어요.\n${err.message || err}`);
    } finally {
      setSub(false);
    }
  }

  function pickSample() {
    const s = window.DullizzeAPI.SAMPLE_TOPICS;
    setTopic(s[Math.floor(Math.random() * s.length)]);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 24, alignItems: 'start' }}>
      <form onSubmit={submit} style={{ display: 'grid', gap: 18 }}>

        {/* hero / topic */}
        <Card padding={28}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h1 style={{ font: '700 26px/1.2 var(--font-display)', letterSpacing: '-0.012em', margin: 0 }}>
                새 쇼츠 만들기
              </h1>
              <p style={{ color: 'var(--fg-muted)', margin: '4px 0 0', fontSize: 14 }}>
                주제 한 줄 + "만들기"만으로 영상이 나와요. 나머지는 자동으로 채워져요.
              </p>
            </div>
            <Button variant="ghost" size="sm" icon="refresh" onClick={pickSample}>예시 주제</Button>
          </div>

          <Field label="주제" hint={`${topic.length} / 200`}>
            <Textarea value={topic} onChange={setTopic} rows={3}
                      placeholder="예) 한국에서 가장 오래된 회사는 어디일까" />
          </Field>

          <div style={{ marginTop: 18 }}>
            <Field label="형 (영상 디자인)">
              <Segmented value={template} onChange={setTpl}
                         options={TEMPLATES.map((t) => ({ value: t.value, label: t.label }))} />
            </Field>
            <div style={{
              marginTop: 10, padding: 12,
              border: '1px solid var(--line-soft)', borderRadius: 8,
              background: 'var(--surface-soft)',
              display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'center',
            }}>
              <img src={tpl.icon} width="44" height="78" alt="" style={{ borderRadius: 4 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{tpl.label}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{tpl.blurb}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* advanced */}
        <Card padding={0}>
          <button type="button" onClick={() => setAdv((v) => !v)}
            style={{
              width: '100%', textAlign: 'left', padding: 18,
              background: 'transparent', border: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>고급 설정</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-muted)', fontSize: 13 }}>
              {advanced ? '접기' : '열기'} <Icon name={advanced ? 'x' : 'chevronDown'} size={15} />
            </span>
          </button>
          {advanced ? (
            <div style={{ padding: '0 18px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="톤"><Input value={tone} onChange={setTone} /></Field>
              <Field label="보이스"><Select value={voice} onChange={setVoice} options={VOICES} /></Field>
              <Field label="비주얼 방식"><Select value={visualMode} onChange={setVM} options={VISUAL_MODES} /></Field>
              <Field label="강조색 (배너형)"><Input value={accentColor} onChange={setAC} /></Field>

              {template === 'banner' ? (
                <React.Fragment>
                  <Field label="상단 헤드라인 1줄" hint="비우면 AI가 채워요">
                    <Input value={headlineMain} onChange={setHM} placeholder="예) 클로드가" />
                  </Field>
                  <Field label="상단 헤드라인 2줄" hint="비우면 AI가 채워요">
                    <Input value={headlineAccent} onChange={setHA} placeholder="예) 인스타를 시작했다" />
                  </Field>
                  <Field label="채널명">
                    <Input value={channelName} onChange={setCN}
                           placeholder="예) 소소한 AI 입문노트 | 소에노" />
                  </Field>
                </React.Fragment>
              ) : null}
            </div>
          ) : null}
        </Card>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Button variant="primary" type="submit" disabled={submitting || !topic.trim()} icon="sparkles">
            {submitting ? '준비 중…' : '영상 만들기'}
          </Button>
          <Button variant="secondary" onClick={() => setTopic('')}>주제 비우기</Button>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-muted)', fontSize: 13 }}>
            1~2분 정도 걸려요. 만들기를 눌러도 나가실 수 있어요.
          </span>
        </div>
      </form>

      {/* right rail — tips & recent */}
      <aside style={{ display: 'grid', gap: 18, position: 'sticky', top: 82 }}>
        <Card title="이런 주제 어때요?" padding={18}>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
            {window.DullizzeAPI.SAMPLE_TOPICS.slice(0, 4).map((s) => (
              <li key={s}>
                <button type="button" onClick={() => setTopic(s)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    border: '1px solid var(--line-soft)', borderRadius: 6,
                    padding: '10px 12px', background: '#fff',
                    fontSize: 13, lineHeight: 1.5, color: 'var(--fg)',
                  }}>
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="알아두면 좋아요" padding={18}>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
            <li>업로드는 항상 <span style={{ color: 'var(--fg)', fontWeight: 600 }}>비공개</span>로 진행돼요. 확인 후 공개로 전환하세요.</li>
            <li>사실 확인은 직접 한 번 더 해주세요. 정보형 콘텐츠라 더 중요해요.</li>
            <li>실패해도 크레딧은 차감되지 않아요.</li>
          </ul>
        </Card>
      </aside>
    </div>
  );
}

Object.assign(window, { Create });
