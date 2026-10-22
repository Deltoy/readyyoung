/* GitHub Pages 전용: google.script.run 을 Apps Script 서버 호출(fetch POST)로 바꾼다.
   암호(k)는 주소의 ?k= 또는 이 기기에 저장된 값. 암호는 이 파일에 없다(서버 Code.gs 에만). */
(function () {
  /* 0927 이름을 고르면 주소에 ?me=이름 을 붙인다 → 그 상태로 '홈 화면에 추가'하면 열 때마다 내 이름으로 (직원별 전용 앱) */
  try {
    var set0 = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      set0.apply(this, arguments);
      if (k === 's_selected_member' && v && this === window.localStorage) {
        var q = new URLSearchParams(location.search);
        if (q.get('me') !== String(v)) { q.set('me', String(v)); q.delete('k'); history.replaceState(history.state, '', location.pathname + '?' + q.toString() + location.hash); }
      }
    };
  } catch (e) {}
})();
(function () {
  if (window.google && window.google.script) return;   /* Apps Script 안에서 열렸거나 테스트 목이 있으면 그대로 */
  var API = 'https://script.google.com/macros/s/AKfycbwvMFIQhV_N1TEso50QSVN7vdMCRXmOUPXDep8p7pKQs1bHvIye7LXbUDANLhzn3pDo/exec';
  var KEY = 'ry_pages_k', q = new URLSearchParams(location.search), k = q.get('k') || '';
  try { if (k) localStorage.setItem(KEY, k); else k = localStorage.getItem(KEY) || ''; } catch (e) {}
  if (q.has('k')) {   /* 주소창·홈 화면 링크에 암호가 남지 않게 지운다 (?me= 는 그대로) */
    q.delete('k');
    try { history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q.toString() : '') + location.hash); } catch (e) {}
  }
  var locked = false;
  /* 1022 MJ '주문 요청이 저장되지 않았어요 (Unexpected token <, <!DOCTYPE)' — 서버가 잠깐 JSON 대신 구글 오류 페이지(HTML)를 줄 때가 있다
     (배포가 바뀌는 순간 · 구글 쪽 일시 오류). 그럴 땐 1.5 · 4 · 8초 뒤 자동으로 다시 보내고, 그래도 안 되면 알아듣기 쉬운 말로 */
  function post(fn, args, key, n) {
    n = n || 0;
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ rpc: fn, args: args, k: key }) })
      .then(function (r) { return r.text(); })
      .then(function (t) {
        try { return JSON.parse(t); } catch (e) {
          if (n < 3) return new Promise(function (res) { setTimeout(res, [1500, 4000, 8000][n]); }).then(function () { return post(fn, args, key, n + 1); });
          var m = /<title>([^<]*)/i.exec(t || '');
          throw new Error('서버가 잠깐 응답하지 않았어요. 잠시 뒤 다시 눌러 주세요.' + (m ? ' (' + m[1].trim().slice(0, 40) + ')' : ''));
        }
      });
  }
  function send(fn, args, ok, fail, uo) {
    if (fn === 'getWebAppUrl') { setTimeout(function () { ok && ok(location.origin + location.pathname, uo); }); return; }   /* 전용 링크는 이 화면 주소로 */
    if (locked || !k) { showGate(); return; }
    post(fn, args, k).then(function (j) {
      if (j && j.__auth) { locked = true; showGate(j.__err); return; }
      if (j && j.__err) { if (fail) fail(new Error(j.__err), uo); else console.error(fn, j.__err); return; }
      ok && ok(j, uo);
    }, function (e) { if (fail) fail(e, uo); else console.error(fn, e); });
  }
  function runner(ok, fail, uo) {
    return new Proxy({}, { get: function (_, name) {
      if (name === 'withSuccessHandler') return function (f) { return runner(f, fail, uo); };
      if (name === 'withFailureHandler') return function (f) { return runner(ok, f, uo); };
      if (name === 'withUserObject') return function (o) { return runner(ok, fail, o); };
      return function () { send(String(name), [].slice.call(arguments), ok, fail, uo); };
    } });
  }
  window.google = { script: { run: runner(null, null), url: { getLocation: function (cb) {
    var p = {}, ps = {}; q.forEach(function (v, key) { p[key] = v; (ps[key] = ps[key] || []).push(v); });
    cb({ parameter: p, parameters: ps, hash: location.hash.slice(1) });
  } } } };

  var gate = null;
  function showGate(msg) {
    if (!document.body) { document.addEventListener('DOMContentLoaded', function () { showGate(msg); }); return; }
    if (gate) { if (msg) gate.querySelector('.m').textContent = msg; return; }
    gate = document.createElement('div'); gate.id = 'ryGate';
    gate.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:#F2F4F7;display:flex;align-items:center;justify-content:center;padding:20px;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",Pretendard,sans-serif;color:#101828');
    gate.innerHTML = '<form style="width:min(340px,100%);background:#fff;border:1px solid #E4E7EC;border-radius:20px;padding:26px 22px;box-shadow:0 2px 12px rgba(16,24,40,.06);text-align:center">'
      + '<img src="ry-icon-192.png" alt="레디영" width="64" height="64" style="border-radius:16px;display:block;margin:0 auto">'
      + '<h1 style="font-size:18px;font-weight:800;margin:14px 0 4px">성수레디영약국</h1>'
      + '<p style="font-size:13px;color:#667085;margin:0 0 18px;line-height:1.6">직원 전용입니다. 받으신 암호를 넣어주세요.<br>한 번 넣으면 이 기기에 기억돼요.</p>'
      + '<input type="password" autocomplete="current-password" aria-label="암호" placeholder="암호" style="width:100%;min-height:52px;border:1px solid #E4E7EC;border-radius:14px;padding:0 14px;font-size:17px;font-weight:700;text-align:center;letter-spacing:2px;box-sizing:border-box;outline-color:#1B57E0">'
      + '<button style="width:100%;min-height:52px;margin-top:10px;border:0;border-radius:14px;background:#1B57E0;color:#fff;font-size:16px;font-weight:800;cursor:pointer">들어가기</button>'
      + '<p class="m" role="alert" style="min-height:18px;margin:10px 0 0;font-size:13px;font-weight:700;color:#B42318"></p></form>';
    document.body.appendChild(gate);
    var f = gate.querySelector('form'), inp = gate.querySelector('input'), btn = gate.querySelector('button'), m = gate.querySelector('.m');
    if (msg) m.textContent = msg;
    setTimeout(function () { inp.focus(); }, 50);
    f.addEventListener('submit', function (ev) {
      ev.preventDefault(); var code = inp.value.trim(); if (!code) return;
      btn.disabled = true; btn.textContent = '확인 중…'; m.textContent = '';
      post('getDataVersion', [], code).then(function (j) {
        if (j && j.__auth) { btn.disabled = false; btn.textContent = '들어가기'; m.textContent = j.__err || '암호가 달라요'; return; }
        try { localStorage.setItem(KEY, code); } catch (e) {}
        location.reload();
      }, function () { btn.disabled = false; btn.textContent = '들어가기'; m.textContent = '서버에 연결하지 못했어요. 잠시 뒤 다시 해주세요.'; });
    });
  }
})();
/* 1013 오래 열어 둔 탭은 옛 판 그대로였다(약국 PC가 며칠째 1007d 사용 → 이미 고친 화면 밀림이 계속 보임).
   → 10분마다·화면에 돌아올 때 새 판이 올라왔는지 보고, 새 판이면 손 놓고 있을 때(입력 중·창 열림 아님, 2분 넘게 조작 없음) 또는 다른 앱에 갔다 올 때 조용히 새로고침 */
(function () {
  if (!/github\.io$/.test(location.hostname)) return;
  var meta = document.querySelector('meta[name="ry-build"]'), cur = meta && meta.content, fresh = false, lastAct = Date.now();
  if (!cur) return;
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) { addEventListener(ev, function () { lastAct = Date.now(); }, { capture: true, passive: true }); });
  function busy() { var a = document.activeElement; return (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) || document.body.style.position === 'fixed' || Date.now() - lastAct < 120000; }
  function check() {
    if (fresh) return;
    fetch(location.pathname + '?ryv=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
      var m = /name="ry-build" content="([^"]+)"/.exec(t || ''); if (m && m[1] !== cur) fresh = true;
    }, function () {});
  }
  setInterval(function () { if (fresh && !busy()) location.reload(); }, 15000);
  setInterval(check, 600000); setTimeout(check, 60000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { if (fresh) location.reload(); else check(); } });
})();
