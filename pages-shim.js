/* GitHub Pages 전용: google.script.run 을 Apps Script 서버 호출(fetch POST)로 바꾼다.
   암호(k)는 주소의 ?k= 또는 이 기기에 저장된 값. 암호는 이 파일에 없다(서버 Code.gs 에만). */
/* 1023 MJ '카톡에서 주소를 누르면 카톡 안 브라우저로 열려 이름 고르기·설치가 안 돼' → 카톡 안이면 바로 밖으로 (아이폰 사파리 · 갤럭시 크롬)
   ?k= 가 지워지기 전(아래)에 주소 그대로 넘긴다. 자동으로 안 넘어가는 폰은 큰 버튼(사용자가 누르면 대부분 넘어감) + 메뉴 안내 */
(function () {
  var ua = navigator.userAgent || '';
  if (!/KAKAOTALK/i.test(ua)) return;
  var url = location.href, and = /Android/i.test(ua), br = and ? '크롬' : '사파리', brRo = and ? '크롬으로' : '사파리로';
  var ext = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(url);
  var chrome = 'intent://' + url.replace(/^https?:\/\//, '') + '#Intent;scheme=https;package=com.android.chrome;end';
  var go = function (u) { try { location.href = u; } catch (e) {} };
  var tried = false;
  try { tried = sessionStorage.getItem('ry_kx') === '1'; sessionStorage.setItem('ry_kx', '1'); } catch (e) {}
  var btn = function (t, u, main) { return '<a href="' + u + '" style="display:block;padding:17px;border-radius:14px;font-size:18px;font-weight:800;text-decoration:none;' + (main ? 'background:#155EEF;color:#fff' : 'background:#F2F4F7;color:#101828') + '">' + t + '</a>'; };
  var card = function () {
    if (!document.body) { document.addEventListener('DOMContentLoaded', card); return; }
    var d = document.createElement('div'); d.id = 'ryKx';
    d.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:#fff;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:24px;text-align:center;color:#101828;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR",sans-serif');
    d.innerHTML = '<div style="font-size:44px">📲</div><b style="font-size:23px">' + br + '에서 열어 주세요</b>'
      + '<p style="margin:0 0 6px;font-size:16px;line-height:1.6;color:#475467">카톡 안에서는 이름 고르기와 앱 설치가 안 돼요.<br>아래 버튼을 누르면 ' + brRo + ' 넘어가요.</p>'
      + btn(brRo + ' 열기', and ? chrome : ext, true) + (and ? btn('다른 브라우저로 열기', ext) : '')
      + '<p style="margin:6px 0 0;font-size:14px;line-height:1.6;color:#667085">그래도 안 넘어가면: 화면 오른쪽 아래 <b>⋮</b> (또는 <b>···</b>) → <b>다른 브라우저로 열기</b></p>';
    document.body.appendChild(d);
    window.addEventListener('load', function () { document.body.appendChild(d); });   // 암호 창 등 나중에 붙는 것보다 위에
    if (!tried) go(and ? chrome : ext);   // 안내를 먼저 그리고 이동 (먼저 이동하면 넘어가지 못한 폰은 빈 화면) · 같은 카톡 창에서 두 번째부턴 자동 이동 안 함 (크롬 없는 폰에서 계속 도는 것 막기)
  };
  card();
})();
(function () {
  /* 0927 이름을 고르면 주소에 ?me=이름 을 붙인다 → 그 상태로 '홈 화면에 추가'하면 열 때마다 내 이름으로 (직원별 전용 앱) */
  try {
    var set0 = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      set0.apply(this, arguments);
      if (k === 's_selected_member' && v && this === window.localStorage) {
        var q = new URLSearchParams(location.search);
        if (q.get('me') !== String(v)) { q.set('me', String(v)); q.delete('k'); history.replaceState(history.state, '', location.pathname + '?' + q.toString() + location.hash); }
        setTimeout(function () { try { window.ryInstallOffer && window.ryInstallOffer(); } catch (e) {} }, 800);
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
  function post(fn, args, key, n, rid) {
    n = n || 0;
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ rpc: fn, args: args, k: key, rid: rid || undefined }) })
      .then(function (r) { return r.text(); })
      .then(function (t) {
        try { return JSON.parse(t); } catch (e) {
          if (n < 3) return new Promise(function (res) { setTimeout(res, [1500, 4000, 8000][n]); }).then(function () { return post(fn, args, key, n + 1, rid); });
          var m = /<title>([^<]*)/i.exec(t || '');
          throw new Error('서버가 잠깐 응답하지 않았어요. 잠시 뒤 다시 눌러 주세요.' + (m ? ' (' + m[1].trim().slice(0, 40) + ')' : ''));
        }
      });
  }
  /* 1029 MJ '저장이 실패하는 상황이 없게 · 실패하면 알아서 다시' — 연결이 끊기면(Failed to fetch 등) 쓰기도 같은 요청 번호(rid)로 다시 보낸다.
     서버가 같은 번호는 한 번만 실행하고 처음 결과를 돌려줘서 두 번 저장되지 않는다. 1.5 · 4 · 10 · 20 · 40초 뒤 (앱이 뒤로 가 있으면 다시 보일 때 바로) */
  var RETRY_MS = [1500, 4000, 10000, 20000, 40000];
  function newRid() { var a = ''; try { var u = new Uint8Array(12); crypto.getRandomValues(u); for (var i = 0; i < u.length; i++) a += ('0' + u[i].toString(16)).slice(-2); } catch (e) { a = Date.now().toString(36) + Math.random().toString(36).slice(2, 12); } return a; }
  function later(ms, f) {
    var t = setTimeout(go, ms), done = false;
    function go() { if (done) return; if (document.hidden) return; done = true; clearTimeout(t); document.removeEventListener('visibilitychange', go); f(); }
    document.addEventListener('visibilitychange', go);   // 폰에서 앱이 뒤로 가 있으면 타이머가 멈추니, 다시 보이면 바로
  }
  function send(fn, args, ok, fail, uo, n, rid) {
    if (fn === 'getWebAppUrl') { setTimeout(function () { ok && ok(location.origin + location.pathname, uo); }); return; }   /* 전용 링크는 이 화면 주소로 */
    if (locked || !k) { showGate(); return; }
    n = n || 0;
    if (!rid && !/^(get|list|search)/.test(fn)) rid = newRid();   // 읽기는 번호 없이 (다시 해도 안전)
    var again = function (e) { if (n >= RETRY_MS.length) { if (fail) fail(e, uo); else console.error(fn, e); return; } later(RETRY_MS[n], function () { send(fn, args, ok, fail, uo, n + 1, rid); }); };
    post(fn, args, k, 0, rid).then(function (j) {
      if (j && j.__auth) { locked = true; showGate(j.__err); return; }
      if (j && j.__busy) { again(new Error(j.__err)); return; }   // 앞의 같은 요청이 아직 처리 중
      if (j && j.__err) { if (fail) fail(new Error(j.__err), uo); else console.error(fn, j.__err); return; }
      ok && ok(j, uo);
    }, function (e) {
      if (/fetch|network|load|서버가 잠깐/i.test(String(e && e.message || e))) { again(e); return; }
      if (fail) fail(e, uo); else console.error(fn, e);
    });
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
    if (/KAKAOTALK/i.test(navigator.userAgent || '')) return;   /* 1023 카톡 안에선 '브라우저로 열기' 안내만 (암호는 넘어간 브라우저에서) */
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
/* 1023 MJ '이름 설정과 설치를 바로' — 크롬이 설치할 수 있다고 알려 주면(beforeinstallprompt) 이름을 고른 뒤 아래에 [📲 앱으로 설치] 한 번
   아이폰 사파리는 설치 버튼을 웹에서 띄울 수 없어 '공유 → 홈 화면에 추가' 안내만. 이미 설치된 앱 안 · [나중에] 누른 날은 안 띄움 */
(function () {
  var ev = null, ua = navigator.userAgent || '', ios = /iPhone|iPad|iPod/i.test(ua) && !/CriOS|FxiOS|KAKAOTALK/i.test(ua);
  var inApp = function () { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
  var today = function () { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); ev = e; offer(); });
  function offer() {
    if (inApp() || document.getElementById('ryInst') || /KAKAOTALK/i.test(ua) || !(ev || ios)) return;
    var me = ''; try { me = localStorage.getItem('s_selected_member') || ''; if (localStorage.getItem('ry_inst_no') === today()) return; } catch (x) {}
    if (!me || !document.body) return;
    var d = document.createElement('div'); d.id = 'ryInst'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', '앱으로 설치');
    d.setAttribute('style', 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:10090;background:#fff;border:1px solid #E4E7EC;border-radius:18px;box-shadow:0 12px 32px -8px rgba(16,24,40,.35);padding:14px;display:flex;align-items:center;gap:10px;font-family:inherit');
    d.innerHTML = '<div style="flex:1;min-width:0;font-size:15px;line-height:1.45;color:#101828"><b>📲 ' + me + ' 님 앱으로 설치</b><br><span style="font-size:13px;color:#475467">' + (ev ? '홈 화면에 아이콘이 생기고 열 때마다 내 이름으로 열려요' : '아래 <b>공유</b> 버튼 → <b>홈 화면에 추가</b>') + '</span></div>'
      + (ev ? '<button type="button" data-go style="flex:none;min-height:48px;padding:0 16px;border:0;border-radius:12px;background:#155EEF;color:#fff;font-size:16px;font-weight:800">설치</button>' : '')
      + '<button type="button" data-no style="flex:none;min-height:48px;padding:0 12px;border:0;border-radius:12px;background:#F2F4F7;color:#344054;font-size:14px;font-weight:700">나중에</button>';
    var go = d.querySelector('[data-go]');
    if (go) go.onclick = function () { var e = ev; ev = null; d.remove(); try { e.prompt(); } catch (x) {} };
    d.querySelector('[data-no]').onclick = function () { try { localStorage.setItem('ry_inst_no', today()); } catch (x) {} d.remove(); };
    document.body.appendChild(d);
  }
  window.ryInstallOffer = offer;
  window.addEventListener('load', function () { setTimeout(offer, 1500); });
})();
