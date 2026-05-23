// fake-api.js — in-memory job store. No network calls.
// Mirrors the FastAPI surface from FRONTEND.md §5 closely enough to be a
// realistic stand-in for the click-through.

(function () {
  const STEPS = [
    { key: 'script',   label: '대본 쓰는 중…' },
    { key: 'tts',      label: '목소리 입히는 중…' },
    { key: 'visual',   label: '이미지 만드는 중…' },
    { key: 'captions', label: '자막 맞추는 중…' },
    { key: 'render',   label: '영상 만드는 중…' },
  ];
  const SAMPLE_TOPICS = [
    '클레오파트라는 이집트인이 아니었다',
    '냉장고에 절대 넣으면 안 되는 음식 5가지',
    '아이슈타인의 마지막 칠판에 적힌 글자',
    '한국에서 가장 오래된 회사는 어디일까',
    '커피를 마시면 키가 안 큰다는 말의 진실',
  ];

  const jobs = {
    'jb_demo1': seedJob('jb_demo1', '클레오파트라는 이집트인이 아니었다', 'documentary', 'done',  4),
    'jb_demo2': seedJob('jb_demo2', '냉장고에 절대 넣으면 안 되는 음식 5가지', 'pop',         'done',  4),
    'jb_demo3': seedJob('jb_demo3', '아이슈타인의 마지막 칠판에 적힌 글자',  'banner',      'done',  4),
    'jb_demo4': seedJob('jb_demo4', '한국에서 가장 오래된 회사는 어디일까',  'documentary', 'failed', 2, '이미지 생성이 잠시 실패했어요. 톤이나 주제를 조금 바꿔보세요.'),
  };

  function seedJob(id, topic, template, status, stepIdx, errMsg) {
    return {
      job_id: id, topic, template, tone: '흥미로운_사실',
      voice: 'ko-KR-SunHiNeural', model: 'claude-haiku-4-5-20251001',
      user_id: 'local', plan: 'pro',
      visual_mode: 'motion_image', visual_provider: 'auto',
      channel_name: '소소한 AI 입문노트 | 소에노',
      headline_main: '', headline_accent: '',
      footer_main: '', footer_accent: '', accent_color: '#ff4fa3',
      status, step: STEPS[stepIdx]?.key || 'render',
      created_at: dateAgo(stepIdx + 1),
      updated_at: dateAgo(stepIdx),
      quota: { used: 8, limit: 20, remaining: 12, plan: 'pro' },
      run_dir: `runs/2026-05-23/${id}`,
      artifacts: status === 'done' ? { video: `runs/2026-05-23/${id}/final.mp4` } : {},
      error: errMsg ? { step: STEPS[stepIdx]?.key, message: errMsg } : null,
    };
  }
  function dateAgo(daysOrSteps) {
    const d = new Date(Date.now() - daysOrSteps * 86400000);
    return d.toISOString().replace('T', ' ').slice(0, 16);
  }

  let pollers = new Map();

  function listJobs() {
    return Object.values(jobs).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }
  function getJob(id) { return jobs[id]; }
  function getQuota() {
    const used = listJobs().filter(j => j.status !== 'failed').length;
    return { used: used + 4, limit: 20, remaining: Math.max(0, 20 - used - 4), plan: 'pro', month: '2026-05' };
  }
  function createJob(body) {
    const id = 'jb_' + Math.random().toString(36).slice(2, 8);
    const j = {
      ...seedJob(id, body.topic || SAMPLE_TOPICS[0], body.template || 'documentary', 'queued', 0),
      ...body, job_id: id, status: 'queued', step: 'script',
      created_at: dateAgo(0), updated_at: dateAgo(0),
      artifacts: {}, error: null,
    };
    jobs[id] = j;
    return j;
  }
  function startPolling(id, onTick) {
    stopPolling(id);
    let stepIdx = 0;
    jobs[id].status = 'running';
    onTick(jobs[id]);
    const t = setInterval(() => {
      const j = jobs[id];
      if (!j) { stopPolling(id); return; }
      stepIdx += 1;
      if (stepIdx >= STEPS.length) {
        j.status = 'done';
        j.step = 'render';
        j.artifacts = { video: `${j.run_dir}/final.mp4` };
        j.updated_at = dateAgo(0);
        onTick(j);
        stopPolling(id);
        return;
      }
      j.step = STEPS[stepIdx].key;
      j.updated_at = dateAgo(0);
      onTick(j);
    }, 1600);
    pollers.set(id, t);
  }
  function stopPolling(id) {
    const t = pollers.get(id);
    if (t) { clearInterval(t); pollers.delete(id); }
  }

  window.DullizzeAPI = {
    STEPS, SAMPLE_TOPICS,
    listJobs, getJob, getQuota, createJob, startPolling, stopPolling,
  };
})();
