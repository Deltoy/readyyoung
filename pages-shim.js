/* GitHub Pages 전용: google.script.run 을 Apps Script 서버 호출(fetch POST)로 바꾼다.
   암호(k)는 주소의 ?k= 또는 이 기기에 저장된 값. 암호는 이 파일에 없다(서버 Code.gs 에만). */
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
  function post(fn, args, key) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ rpc: fn, args: args, k: key }) })
      .then(function (r) { return r.json(); });
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
      + '<h1 style="font-size:18px;font-weight:800;margin:14px 0 4px">성수 레디영 물류센터</h1>'
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
