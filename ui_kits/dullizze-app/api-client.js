// api-client.js — real FastAPI adapter.
// Keep fake-api.js loaded first; pass ?api=mock to keep the in-memory mock.

(function () {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('api') || localStorage.getItem('DLZ_API_MODE') || 'real';
  if (mode === 'mock') return;

  const fallback = window.DullizzeAPI || {};
  const API_BASE = (params.get('apiBase') || localStorage.getItem('DLZ_API_BASE') || 'http://localhost:8000').replace(/\/$/, '');
  const DEFAULT_USER = params.get('user') || localStorage.getItem('DLZ_USER_ID') || 'local';
  const DEFAULT_PLAN = params.get('plan') || localStorage.getItem('DLZ_PLAN') || 'pro';
  const STORAGE_KEY = 'DLZ_REAL_JOB_IDS';

  const STEPS = fallback.STEPS || [
    { key: 'script', label: '대본 쓰는 중' },
    { key: 'tts', label: '목소리 입히는 중' },
    { key: 'visual', label: '이미지 만드는 중' },
    { key: 'captions', label: '자막 맞추는 중' },
    { key: 'render', label: '영상 만드는 중' },
  ];
  const SAMPLE_TOPICS = fallback.SAMPLE_TOPICS || [
    '클레오파트라는 이집트인이 아니었다',
    '냉장고에 넣으면 안 되는 음식 5가지',
    '커피를 마시면 잠이 더 온다는 말의 진실',
  ];

  const cache = {
    connected: false,
    statusText: 'API 연결 확인 중',
    error: null,
    jobs: {},
    quota: { used: 0, limit: 20, remaining: 20, plan: DEFAULT_PLAN, month: '' },
  };
  const pollers = new Map();
  const listeners = new Set();

  function loadKnownIds() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function saveKnownIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(ids)].slice(0, 80)));
  }

  let knownIds = loadKnownIds();

  function emit() {
    listeners.forEach((fn) => fn());
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function setStatus(connected, statusText, error) {
    cache.connected = connected;
    cache.statusText = statusText;
    cache.error = error || null;
    emit();
  }

  async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`;
      try {
        const body = await res.json();
        detail = body.detail || detail;
      } catch {
        detail = await res.text() || detail;
      }
      throw new Error(detail);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  function remember(job) {
    if (!job || !job.job_id) return job;
    cache.jobs[job.job_id] = job;
    knownIds = [job.job_id, ...knownIds.filter((id) => id !== job.job_id)];
    saveKnownIds(knownIds);
    return job;
  }

  function sortJobs(items) {
    return items.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')));
  }

  async function refreshHealth() {
    try {
      await request('/health');
      setStatus(true, 'API · 연결됨');
      return true;
    } catch (e) {
      setStatus(false, 'API · 연결 안 됨', e.message);
      return false;
    }
  }

  async function refreshQuota(userId = DEFAULT_USER, plan = DEFAULT_PLAN) {
    try {
      cache.quota = await request(`/users/${encodeURIComponent(userId)}/quota?plan=${encodeURIComponent(plan)}`);
      setStatus(true, 'API · 연결됨');
      return cache.quota;
    } catch (e) {
      cache.error = e.message;
      emit();
      return cache.quota;
    }
  }

  async function refreshJob(id) {
    const job = await request(`/jobs/${encodeURIComponent(id)}`);
    remember(job);
    setStatus(true, 'API · 연결됨');
    emit();
    return job;
  }

  async function refreshJobs() {
    try {
      const jobs = await request(`/jobs?user_id=${encodeURIComponent(DEFAULT_USER)}&limit=80`);
      jobs.forEach(remember);
      setStatus(true, 'API · 연결됨');
      await refreshQuota();
      emit();
      return listJobs();
    } catch (e) {
      cache.error = e.message;
      await Promise.allSettled(knownIds.map((id) => refreshJob(id)));
      emit();
      return listJobs();
    }
  }

  function listJobs() {
    return sortJobs(Object.values(cache.jobs));
  }

  function getJob(id) {
    if (!cache.jobs[id]) refreshJob(id).catch((e) => { cache.error = e.message; emit(); });
    return cache.jobs[id];
  }

  function getQuota() {
    return cache.quota;
  }

  function getStatus() {
    return {
      connected: cache.connected,
      text: cache.statusText,
      error: cache.error,
      apiBase: API_BASE,
      mode: 'real',
    };
  }

  async function createJob(body) {
    const payload = {
      user_id: DEFAULT_USER,
      plan: DEFAULT_PLAN,
      visual_provider: 'auto',
      auto_start: true,
      ...body,
    };
    const job = await request('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    remember(job);
    await refreshQuota();
    emit();
    return job;
  }

  function startPolling(id, onTick) {
    stopPolling(id);
    const tick = async () => {
      try {
        const job = await refreshJob(id);
        onTick?.(job);
        if (job.status === 'done' || job.status === 'failed') stopPolling(id);
      } catch (e) {
        cache.error = e.message;
        emit();
      }
    };
    tick();
    pollers.set(id, setInterval(tick, 2200));
  }

  function stopPolling(id) {
    const timer = pollers.get(id);
    if (timer) clearInterval(timer);
    pollers.delete(id);
  }

  function getVideoUrl(job) {
    if (!job?.job_id || job.status !== 'done') return '';
    return `${API_BASE}/jobs/${encodeURIComponent(job.job_id)}/video`;
  }

  window.DullizzeAPI = {
    STEPS,
    SAMPLE_TOPICS,
    API_BASE,
    onChange,
    getStatus,
    refreshHealth,
    refreshQuota,
    refreshJobs,
    refreshJob,
    listJobs,
    getJob,
    getQuota,
    createJob,
    startPolling,
    stopPolling,
    getVideoUrl,
  };

  refreshHealth().then(() => {
    refreshJobs();
  });
})();
