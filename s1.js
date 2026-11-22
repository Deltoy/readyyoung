/* 1122 업그레이드 S1 '시각 정돈' (plan.md §S1 · D3 토큰 + D4 겹침 0) — 문준 화면에만, pages-shim 이 불러옴 (unslop.js 대신)
   끄기 ?s1=0 / 다시 켜기 ?s1=1 (기기에 기억). 직원 화면은 그대로. 서버(Code) 안 바꿈.
   D3: 글자 12·13·15·17·20·28 · 글자색 4(#111827 #344054 #5F6672 #FFF)+주색 #155EEF+상태 3(#067647 #B54708 #D92D20) · 둥글기 12/20/999
       --ry-* 는 그대로 두고 --z- --c- --k- --ap- 는 --ry-* 별칭으로. (unslop 의 굵기≤600·홀수 간격→짝수는 이어받음)
   D4: 말풍선 = 헤더 아래 한 줄(흐름 안) · 동기화 = 헤더의 작은 점 · 위쪽 알림 카드 = 헤더 아래 흐름 안(시트 위로 안 뜸)
       · 따라오는 춤 로고 = 말 끝나고 4.5초 뒤 왼쪽 끝으로 살짝 숨어서 계속 춤(누르면 다시 나옴) · 폭죽 = 하루 한 번(세트 여러 개면 한 장), 3.8초 뒤 저절로 닫힘, 그 뒤 달성은 말풍선 한 줄
   덤: 판매 목표 폰 줄 잘림 · PC 카드 4장 2×2 */
(function () {
  if (window.__s1) return; window.__s1 = 1;
  var D = document, root = D.documentElement;
  root.classList.add('s1');

  /* ---------- D3 토큰 ---------- */
  var BR = '#155EEF', TX = ['#111827', '#344054', '#5F6672', '#FFFFFF'], OK = '#067647', WARN = '#B54708', BAD = '#B42318';
  var css = [
    'html:root:not(#s1){--ry-brand:' + BR + ';--ry-brand-deep:#111827;--ry-brand-soft:#EFF4FF;--ry-ink:#111827;--ry-ink-2:#344054;--ry-ink-3:#5F6672;--ry-ink-4:#5F6672;--ry-ok:' + OK + ';--ry-warn:' + WARN + ';--ry-bad:' + BAD + ';--ry-r1:12px;--ry-r2:12px;--ry-r3:20px;--ry-canvas:#F5F6F8;--ry-line:#EDEEF0;',
    '--z-pri:var(--ry-brand);--z-pri-d:var(--ry-brand-deep);--z-pri-soft:var(--ry-brand-soft);--z-ink:var(--ry-ink);--z-ink2:var(--ry-ink-2);--z-mute:var(--ry-ink-3);--z-mute2:var(--ry-ink-3);--z-ok:var(--ry-ok);--z-warn:var(--ry-warn);--z-bad:var(--ry-bad);--z-r:20px;--z-bg:var(--ry-canvas);--z-line:var(--ry-line);',
    '--ap-focus:var(--ry-brand)}',
    'html:root:not(#s1) body .ry25-king{--k-pri:var(--ry-brand);--k-blue:var(--ry-brand);--k-line:var(--ry-line)}',
    'html:root:not(#s1) body .mb-rd{--c-pri:var(--ry-brand);--c-ink:var(--ry-ink);--c-ink2:var(--ry-ink-2);--c-ink3:var(--ry-ink-3);--c-pri-t:var(--ry-brand-deep)}',
    /* D4 동기화 알약 → 헤더 작은 점 (누르면 새로고침 그대로 · 누르는 칸 44px) */
    'html:not(#q):not(#w):not(#e) body:not(#r):not(#s1) #loading.sync-pill.s1-dot{position:relative!important;inset:auto!important;bottom:auto!important;right:auto!important;top:auto!important;z-index:auto!important;flex:none;width:44px!important;height:44px!important;min-height:44px!important;padding:0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;opacity:1!important;pointer-events:auto!important;display:grid!important;place-items:center;font-size:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}',
    '#loading.s1-dot>*{display:none!important}',
    '#loading.s1-dot::before{content:"";width:10px;height:10px;border-radius:999px;background:#667085;box-shadow:0 0 0 3px #fff}',
    '#loading.s1-dot[data-state="syncing"]::before{background:' + BR + ';animation:s1Pulse 1s ease-in-out infinite}',
    '#loading.s1-dot[data-state="done"]::before{background:#067647}',
    '#loading.s1-dot[data-state="error"]::before{background:#B42318}',
    'html:not(#q):not(#w):not(#e) body:not(#r):not(#s1) #loading.sync-pill.s1-dot[data-state="error"]{width:auto!important;padding:0 10px!important;gap:6px;grid-auto-flow:column}',
    '#loading.s1-dot[data-state="error"]::after{content:"동기화 실패";font-size:12px;font-weight:600;color:#B42318}',
    '@keyframes s1Pulse{50%{transform:scale(.55);opacity:.5}}',
    '@media(prefers-reduced-motion:reduce){#loading.s1-dot::before{animation:none!important}}',
    /* 1122 MJ '말풍선 왜 이렇게 길어졌어' → 글자 길이만큼(fit-content) · D4 말풍선 → 헤더 아래 한 줄 (계속 보이는 응원 줄, 말 바뀔 때만 톡) */
    'html body header.ry25-top{position:relative}',
    'html body #ryHeatSay.s1-in{position:absolute!important;left:12px!important;top:calc(100% + 2px)!important;display:none!important;visibility:visible!important;opacity:1!important;transform:none;width:fit-content!important;max-width:calc(100% - 24px)!important;padding:5px 12px!important;margin:0;border-radius:999px!important;box-shadow:0 4px 14px rgba(17,24,39,.12)!important;pointer-events:none;z-index:40!important}',
    'html body #ryHeatSay.s1-in.s1-show{display:block!important}',
    'html body #ryHeatSay.s1-in.s1-off{display:none!important}',
    'html body #ryHeatSay.s1-in.in{animation:s1Pop .35s cubic-bezier(.2,1.5,.4,1)}',
    '@keyframes s1Pop{from{transform:scale(.92)}to{transform:none}}',
    '@media(prefers-reduced-motion:reduce){html body #ryHeatSay.s1-in.in{animation:none}}',
    /* D4 위쪽 알림 카드 → 헤더 아래 흐름 안 (시트·판매 목표 위로 안 뜸). 꼭 봐야 하는 .force(가운데 창)는 그대로 */
    'html body #ryTopPops.s1-in:not(.force){position:relative!important;left:auto!important;top:auto!important;transform:none!important;width:auto!important;max-width:none;margin:0;z-index:auto!important;pointer-events:auto}',
    'html body #ryTopPops.s1-in:not(.force):empty,html body #ryTopPops.s1-in:not(.force):not(:has(>:not([hidden]))){display:none!important}',
    /* D4 따라오는 춤 로고: 말 끝나고 잠시 뒤 왼쪽 끝으로 살짝 숨어 계속 춤 · 누르면 다시 */
    'html body #ryDzFloat.on.s1-peek{transform:translateX(-82%) scale(.8)!important;opacity:.95}',
    /* 덤: 판매 목표 폰 줄 — 잘리지 않게(두 줄까지) */
    'html body .sc-mr3>span{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;line-height:1.35}',
    /* 덤: PC 판매 목표 카드 4장 = 2×2 (3열이면 빈칸 2개) */
    '@media(prefers-reduced-motion:reduce){html:not(#q):not(#w):not(#e):not(#s1) body:not(#r) *,html:not(#q):not(#w):not(#e):not(#s1) body:not(#r) *::before,html:not(#q):not(#w):not(#e):not(#s1) body:not(#r) *::after{animation-iteration-count:1!important}}',
    'html body .sd-ln-sep{color:var(--ry-ink-3)!important;opacity:.55}',
    'html.s1 input,html.s1 select,html.s1 textarea{font-size:16px!important}',   /* 아이폰 입력칸 확대 막기 */
    '@media(max-width:600px){html body #ryTopPops.s1-in:not(.force)>div{padding:8px 8px 8px 12px!important}html body #ryTopPops.s1-in:not(.force) .tp-txt p{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;margin:0}html body #ryTopPops.s1-in:not(.force) .tp-txt{flex:1;min-width:0}html body #ryTopPops.s1-in:not(.force) .tp-txt .t{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}',
    '@media(min-width:601px){html body .sc-sets:has(>:nth-child(4):last-child),html body .sc-charts:has(>:nth-child(4):last-child){grid-template-columns:repeat(2,minmax(0,1fr))!important}}'
  ].join('\n');
  var st = D.createElement('style'); st.id = 'ryS1'; st.textContent = css; D.head.appendChild(st);

  /* ---------- 스타일 규칙 고치기 (unslop 방식 + S1 토큰) ---------- */
  var SIZES = [12, 13, 15, 17, 20, 28];
  var snapSize = function (px) { return SIZES.reduce(function (a, b) { return Math.abs(b - px) < Math.abs(a - px) ? b : a; }); };
  var GRAYS = ['#111827', '#344054', '#475467', '#667085', '#98A2B3', '#D0D5DD', '#EDEEF0', '#F5F6F8', '#F9FAFB', '#FFFFFF'];
  var hex2 = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); };
  var lum = function (c) { return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; };
  var GL = GRAYS.map(function (g) { return lum(hex2(g)); });
  var rootCS = null;
  function parse(v) {   // → [r,g,b,a] 또는 null
    v = String(v || '').trim();
    var m = v.match(/^var\((--[\w-]+)\)$/); if (m) { rootCS = rootCS || getComputedStyle(root); v = rootCS.getPropertyValue(m[1]).trim(); }
    if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v.slice(1).split('').map(function (x) { return x + x; }).join('');
    if (/^#[0-9a-f]{6}$/i.test(v)) return hex2(v).concat(1);
    m = v.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[,/]\s*([\d.]+%?|var\([^)]*\)))?\s*\)$/i);
    if (m) { var a = m[4] == null || /^var/.test(m[4]) ? 1 : /%$/.test(m[4]) ? parseFloat(m[4]) / 100 : +m[4]; return [+m[1], +m[2], +m[3], a]; }
    return null;
  }
  function hue(c) { var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return 0; var h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; return h < 0 ? h + 360 : h; }
  function textColor(v) {   // 글자색 → 8개 안으로
    var c = parse(v); if (!c || c[3] < 1) return null;   // 반투명 글자는 위계라 그대로
    var mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]), L = lum(c);
    if (mx - mn < 50 || (mx ? (mx - mn) / mx : 0) < 0.35) { if (L < 45) return TX[0]; if (L < 100) return TX[1]; if (L < 190) return TX[2]; if (L >= 232) return TX[3]; return null; }
    if (L > 200) return null;   // 진한 바탕 위 옅은 색 글자는 그대로
    var h = hue(c);
    if (h >= 290 && h < 345) return null;   // 분홍·자주(세트 색)는 그대로
    if (h >= 195 && h < 290) return BR; if (h >= 75 && h < 195) return OK; if (h >= 22 && h < 75) return WARN; return BAD;
  }
  function otherColor(v) {   // 바탕·테두리: 회색 10단계 + 진한 파랑 → 주색 (보라·세트 색은 그대로)
    var c = parse(v); if (!c || c[3] < 1) return null;
    var mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]), sat = mx ? (mx - mn) / mx : 0, L = lum(c);
    if (sat < 0.12) { var i = 0; GL.forEach(function (g, k) { if (Math.abs(g - L) < Math.abs(GL[i] - L)) i = k; }); return Math.abs(GL[i] - L) <= 18 ? GRAYS[i] : null; }
    var h = hue(c); if (h >= 205 && h < 235 && L < 170 && sat > 0.5) return BR;
    return null;
  }
  function snapR(v) {   // 둥글기 12 / 20 / 999
    return v.split(/\s+/).map(function (p) {
      if (/%$/.test(p)) return parseFloat(p) ? '999px' : p;
      var m = p.match(/^([\d.]+)(px|rem)$/); if (!m) return p; var n = +m[1] * (m[2] === 'rem' ? 16 : 1);
      return !n ? p : n <= 15 ? '12px' : n <= 40 ? '20px' : '999px';
    }).join(' ');
  }
  var PAD = ['padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin-top', 'margin-bottom', 'gap', 'row-gap', 'column-gap'];
  var BG = ['background-color', 'border-color', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color'];
  var RAD = ['border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'];
  function fixDecl(s, sel) {
    var sc = sel && /\.(sc|scf)-|#scFan|#slPage/.test(sel);   // 판매 목표 색은 plan §5 대로 그대로
    var pr = function (p) { return s.getPropertyPriority(p); }, set = function (p, v) { if (v != null && s.getPropertyValue(p).trim() !== v) s.setProperty(p, v, pr(p)); };
    var f = s.getPropertyValue('font-size').trim(), m = f.match(/^([\d.]+)(px|rem)$/);
    if (m) { var px = +m[1] * (m[2] === 'rem' ? 16 : 1); if (px >= 9 && px <= 40) set('font-size', snapSize(px) + 'px'); }
    if (+s.getPropertyValue('font-weight') >= 700) set('font-weight', '600');
    var c = s.getPropertyValue('color'); if (c) { var tc = textColor(c); if (!sc || TX.indexOf(tc) >= 0) set('color', tc); }   // 판매 목표: 회색만 맞추고 색(세트·불·달성)은 그대로
    BG.forEach(function (p) { var v = s.getPropertyValue(p); if (v) set(p, otherColor(v)); });
    RAD.forEach(function (p) { var v = s.getPropertyValue(p).trim(); if (v && /\d/.test(v) && !/var\(|calc|max|min/.test(v)) set(p, snapR(v)); });
    PAD.forEach(function (p) { var v = s.getPropertyValue(p); if (/^\d+px$/.test(v)) { var n = parseInt(v, 10); if (n > 2 && n % 2) set(p, (n + 1) + 'px'); } });
  }
  function walk(rules) { for (var i = 0; i < rules.length; i++) { var r = rules[i]; try { if (r.style) fixDecl(r.style, r.selectorText || ''); if (r.cssRules) walk(r.cssRules); } catch (e) {} } }
  function sheets() { for (var i = 0; i < D.styleSheets.length; i++) { var s = D.styleSheets[i]; if (s.__us || s.ownerNode === st) continue; try { walk(s.cssRules); s.__us = 1; } catch (e) {} } }
  function inline(rootEl) { if (rootEl.nodeType !== 1) return; var l = rootEl.matches('[style]') ? [rootEl] : []; l = l.concat([].slice.call(rootEl.querySelectorAll('[style]'))); l.forEach(function (el) { fixDecl(el.style, el.closest('[class*="sc-"],#slPage') ? '.sc-x' : ''); }); }
  /* 규칙에 안 잡힌 글자 크기(em·% 등)만 계산값으로 한 번 더 — 색은 상태마다 바뀌니 계산값으로는 안 건드림 */
  function sizePass(rootEl) {
    var l = rootEl.querySelectorAll ? rootEl.querySelectorAll('*') : [];
    for (var i = 0; i < l.length; i++) { var el = l[i]; if (el.__s1f || !el.firstChild) continue; var has = false; for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.nodeValue.trim()) { has = true; break; } if (!has) continue;
      var px = parseFloat(getComputedStyle(el).fontSize); if (px >= 9 && px <= 40 && SIZES.indexOf(px) < 0) el.style.setProperty('font-size', snapSize(px) + 'px', 'important'); el.__s1f = 1; }
  }

  /* ---------- D4 겹침 없애기 ---------- */
  function hdr() { return D.querySelector('header.ry25-top'); }
  function slot() { return D.getElementById('ryMain'); }   // 본문 맨 위 (헤더 바로 아래, 본문과 같은 폭)
  function place() {
    var h = hdr(); if (!h) return;
    var pill = D.getElementById('loading'), user = h.querySelector('.ry25-user');
    if (pill && user && pill.parentNode !== user) { pill.classList.add('s1-dot'); pill.setAttribute('role', 'button'); pill.setAttribute('aria-label', '동기화 상태 · 누르면 지금 새로고침'); user.insertBefore(pill, user.firstChild); }
    var tp = D.getElementById('ryTopPops'), mn = slot(); if (tp && mn && tp.parentNode !== mn) { tp.classList.add('s1-in'); mn.insertBefore(tp, mn.firstChild); }
  }
  function floatOn() { var f = D.getElementById('ryDzFloat'); return !!(f && f.classList.contains('on')); }
  function sayPlace() {   // 말풍선: 위 로고가 보이면 헤더 아래 줄 · 따라오는 로고면 원래처럼 그 위
    var b = D.getElementById('ryHeatSay'), h = hdr(); if (!b || !h) return;
    if (floatOn()) { if (b.classList.contains('s1-in')) { b.classList.remove('s1-in'); D.body.appendChild(b); } return; }
    b.classList.add('s1-in'); if (b.parentNode !== h) h.appendChild(b);   // 1122 MJ '한 줄 쓰지 마 칸 아까워' → 줄 차지 X, 헤더 아래 잠깐 떴다 사라짐(5초)   // 원래 heatSay 가 className 을 통째로 바꾸므로 매번 다시
    b.classList.toggle('s1-off', typeof scOpenHr === 'function' && !scOpenHr());
  }
  if (typeof window.heatSay === 'function') {
    var _say = window.heatSay;
    window.heatSay = function (txt) { var f = D.getElementById('ryDzFloat'); if (f) { f.classList.remove('s1-peek'); f.__s1t = Date.now(); } sayPlace(); var r = _say.apply(this, arguments); sayPlace(); var bb = D.getElementById('ryHeatSay'); if (bb) { bb.classList.add('s1-show'); clearTimeout(bb.__s1h); bb.__s1h = setTimeout(function () { bb.classList.remove('s1-show'); }, 5000); } return r; };
  }
  /* 폭죽: 하루 한 번(그날 처음 달성 때 한 장에 모아서) · 그 뒤 달성은 말풍선 한 줄. 3.8초 뒤 저절로 닫힘은 원래대로 */
  if (typeof window.scFanfareCheck === 'function' && typeof window.scFanfare === 'function') {
    window.scFanfareCheck = function () {
      try {
        var Dd = SC.data, w = Dd && scUse(); if (!w || !Dd.today || Dd.today < w.from || Dd.today > w.to) return;
        var t = Dd.today, mem = function (k) { try { if (localStorage.getItem(k)) return true; localStorage.setItem(k, '1'); } catch (e) { if (SC['fan_' + k]) return true; SC['fan_' + k] = 1; } return false; };
        var hit = SC_SETS.filter(function (s) { return scOk(Dd.cfg, t, s.k) && !mem('ry_fan_' + t + '_' + s.k); }); if (!hit.length) return;
        var done = SC_SETS.filter(function (s) { return scOk(Dd.cfg, t, s.k); }).length;
        if (mem('ry_fan1_' + t) || D.getElementById('scFan')) { window.heatSay('🎉 ' + hit.map(function (s) { return s.label; }).join(' · ') + ' 목표 달성! (' + done + '/' + SC_SETS.length + ')'); return; }
        SC.fanQ = [];
        window.scFanfare(hit.map(function (s, i) { return { label: s.label, v: scV(t, s.k), g: scGoal(Dd.cfg, t, s.k), nth: i ? 0 : done, of: i ? 0 : SC_SETS.length }; }));
      } catch (e) {}
    };
  }
  /* 시트 판단 (#tutPop 이 다른 창 위로 안 뜨게 — 흐름 안으로 옮겨서 해결되지만, 만약 .force 아닌데 떠 있으면 숨김) */
  function tick() {
    place(); sayPlace(); var hg = D.getElementById('ryHG'); if (hg) hgSpot(hg);
    var f = D.getElementById('ryDzFloat');
    if (f) { if (!f.classList.contains('on')) { f.__s1t = 0; f.classList.remove('s1-peek'); } else { if (!f.__s1t) f.__s1t = Date.now(); var b = D.getElementById('ryHeatSay'); if (Date.now() - f.__s1t > 4500 && !(b && !b.hidden && !b.classList.contains('s1-in'))) f.classList.add('s1-peek'); } }
  }
  /* 판매 목표 폰 줄: 이번 주와 같은 기간 글자는 위 카드에 이미 있으니 빼고 짧게 */
  function scRows(rootEl) {
    var sec = rootEl.querySelectorAll ? rootEl.querySelectorAll('.sc-mob') : []; [].forEach.call(sec, function (s) {
      var pers = s.querySelectorAll('.sc-mr3 .sc-per'), same = pers.length && [].every.call(pers, function (p) { return p.textContent === pers[0].textContent; });
      [].forEach.call(s.querySelectorAll('.sc-mr3>span'), function (sp) {
        if (sp.__s1) return; sp.__s1 = 1;
        var p = sp.querySelector('.sc-per'); if (same && p) { var nx = p.nextSibling; p.remove(); if (nx && nx.nodeType === 3) nx.nodeValue = nx.nodeValue.replace(/^\s*·\s*/, ''); }
        [].forEach.call(sp.childNodes, function (n) { if (n.nodeType === 3) n.nodeValue = n.nodeValue.replace(/주 남은 (\d+) · 하루 평균 (\d+) 필요/, '주 $1개 남음 · 하루 $2개 필요'); });
      });
    });
  }

  /* ---------- 1122 홈 '판매 목표 게이지' (plan §2-A · MJ '판매 목표 게이지 좋아') ----------
     이번 주 링(%) + 세트별 오늘 막대(세트 색) + 가장 가까운 세트 '🔥 N개만 더!' + 오늘 남은 합계 · 지금 내 담당 시간이면 한 줄.
     자료 = 이미 홈이 받는 SC.data(getSetChallenge, 4.5초 뒤·캐시 ry_sc) 그대로 — 새 서버 호출 없음. 누르면 📊 판매 목표(slOpen). */
  var hgCss = [   /* 1122 MJ '좀 더 간소화 · 칸이 너무 커' + '홈은 상태 요약만, 자세한 건 눌러서' → 링 + 한 줄 + 칩 한 줄 */
    '#ryHG{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:center;width:100%;min-height:44px;text-align:left;font:inherit;color:#111827;background:#fff;border:1px solid #EDEEF0;border-radius:20px;padding:8px 12px;margin:0;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .15s ease}',
    '#ryHG[hidden]{display:none!important}#ryHG span{display:block}#ryHG:active{transform:scale(.985)}#ryHG:focus-visible{outline:2px solid ' + BR + ';outline-offset:2px}',
    '#ryHG .hg-r{position:relative;width:44px;height:44px}#ryHG .hg-r svg{display:block;width:44px;height:44px;transform:rotate(-90deg)}',
    '#ryHG .hg-r circle{fill:none;stroke-width:3.6}#ryHG .hg-r .bg{stroke:#EDEEF0}#ryHG .hg-r .fg{stroke-linecap:round;transition:stroke-dasharray .9s cubic-bezier(.2,.8,.2,1)}',
    '#ryHG .hg-r b{position:absolute;inset:0;display:grid;place-content:center;font-size:12px;font-weight:600;font-variant-numeric:tabular-nums}',
    '#ryHG .hg-s{min-width:0;display:grid;gap:4px}',
    '#ryHG .hg-h{display:flex!important;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#344054;min-width:0}',
    '#ryHG .hg-h>span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#ryHG .hg-h>span.near{color:#B54708}#ryHG .hg-h>span.win{color:#067647}',
    '#ryHG .hg-h .hg-v{display:none;flex:none;font-size:12px;color:#B54708}#ryHG .hg-h .hg-v.ok{color:#067647}',
    '#ryHG .hg-h i{flex:none;font-style:normal;color:' + BR + ';font-size:15px;line-height:1}',
    '#ryHG .hg-c{display:flex!important;flex-wrap:wrap;gap:4px}',
    '#ryHG .hg-c>span{display:inline-block!important;padding:2px 8px 3px;border-radius:999px;background:#F5F6F8 no-repeat left bottom;font-size:12px;font-weight:600;color:#344054;white-space:nowrap;font-variant-numeric:tabular-nums;transition:background-size .9s cubic-bezier(.2,.8,.2,1)}',
    '#ryHG .hg-c>span.ok{color:#5F6672}#ryHG .hg-c>span.hot{background-color:#FFF4ED;color:#B54708;animation:hgPop .5s cubic-bezier(.2,1.5,.4,1) 1}',
    '@keyframes hgPop{50%{transform:scale(1.1)}}',
    '@media(min-width:601px){#ryHG .hg-h .hg-v{display:block}}',
    '@media(prefers-reduced-motion:reduce){#ryHG,#ryHG *{transition:none!important;animation:none!important}}'
].join('\n');
  var hgSt = D.createElement('style'); hgSt.id = 'ryHGcss'; hgSt.textContent = hgCss; D.head.appendChild(hgSt); try { hgSt.sheet.__us = 1; } catch (e) {}
  var hgEsc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function hgData() {   // → null(이번 목표 없음) 또는 {wp, rows[{label,c,v,g,ok}], rem, near, done, n}
    if (typeof SC === 'undefined' || typeof scUse !== 'function') return null;
    if (!SC.data) { try { var c0 = JSON.parse(localStorage.getItem('ry_sc') || 'null'); if (c0 && c0.cfg) SC.data = c0; } catch (e) {} }
    var Dd = SC.data, w = Dd && Dd.cfg && Dd.cfg.weeks ? scUse() : null, t = Dd && Dd.today; if (!w || !t) return null;
    var sum = 0, G = 0, rows = [], pS = 0, pE = 0;
    SC_SETS.forEach(function (s) {
      var days = scDaysOf(w, s.k), wg = scWG(w, s.k); G += wg; days.forEach(function (d) { if (d <= t) sum += scV(d, s.k) || 0; if (d < t) { pS += scV(d, s.k) || 0; pE += wg / days.length; } });
      var g = scGoal(Dd.cfg, t, s.k); if (g > 0) { var v = scV(t, s.k) || 0; rows.push({ label: String(s.label || '').replace(/\s*\(.*\)\s*$/, ''), sh: typeof scShort === 'function' ? scShort(s.label) : s.label, c: s.c, v: v, g: g, ok: v >= g }); }
    });
    if (!rows.length && !G) return null;
    var open = rows.filter(function (r) { return !r.ok; }).sort(function (a, b) { return (a.g - a.v) - (b.g - b.v); });
    return { lag: pE >= 1 ? Math.round(pE - pS) : null, wp: G ? Math.round(sum / G * 100) : 0, rows: rows, near: open[0] || null, rem: open.reduce(function (a, r) { return a + r.g - r.v; }, 0), done: rows.length - open.length, n: rows.length, any: rows.some(function (r) { return r.v > 0; }) };
  }
  function hgMine() {   // 지금 시간대 세트 담당이 나면 true
    try { var t = sdToday(), sl = sdNowSlot(), me = currentSelectedMember; return !!(t && sl && me && t[sl] && (t[sl].cn === me || t[sl].jp === me)); } catch (e) { return false; }
  }
  function hgRender() {
    var mn = slot(); if (!mn) return;
    var el = D.getElementById('ryHG'), x = hgData();
    if (!x) { if (el) el.hidden = true; return; }   // 이번 목표 없으면 숨김
    if (!el) { el = D.createElement('button'); el.type = 'button'; el.id = 'ryHG'; el.onclick = function () { try { slOpen(); } catch (e) {} }; }
    hgSpot(el); el.hidden = false;
    var C = 2 * Math.PI * 15.9, wp = Math.min(100, x.wp), all = x.n && x.done === x.n, mine = hgMine();
    var near = x.near && x.near.g - x.near.v;
    var f = all ? ['win', '🏆 오늘 목표 전부 달성!']
      : !x.any ? ['', '첫 세트 팔리면 채워져요 🙌']
      : near <= 3 ? ['near', '🔥 ' + hgEsc(x.near.sh) + ' ' + near + '개만 더!']
      : ['', '🎯 ' + hgEsc(x.near.sh) + ' ' + near + '개 더 → 오늘 달성'];
    if (mine && !all) f[1] = '💪 내 담당 · ' + f[1];
    var key = JSON.stringify([x, mine]);
    if (el.__k === key) return; var first = !el.__k; el.__k = key;
    el.setAttribute('aria-label', '판매 목표 이번 주 ' + x.wp + '% — 자세히 보기');
    el.innerHTML = '<span class="hg-r"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="15.9"/><circle class="fg" cx="18" cy="18" r="15.9" stroke="' + (x.wp >= 100 ? OK : BR) + '" stroke-dasharray="' + (first ? 0 : wp / 100 * C) + ' ' + C + '"/></svg><b>' + x.wp + '%</b></span>'
      + '<span class="hg-s"><span class="hg-h"><span class="' + f[0] + '">' + f[1] + '</span>'
      + (x.lag == null ? '' : x.lag <= 0 ? '<b class="hg-v ok">어제까지 순항 ✓</b>' : '<b class="hg-v">어제까지 ' + x.lag + '개 뒤처짐</b>') + '<i aria-hidden="true">›</i></span>'
      + '<span class="hg-c">' + x.rows.map(function (r) { var p = Math.min(100, Math.round(r.v / r.g * 100)); return '<span title="' + hgEsc(r.label) + '" class="' + (r.ok ? 'ok' : r === x.near && !all && x.any ? 'hot' : '') + '" style="background-image:linear-gradient(' + hgEsc(r.c) + ',' + hgEsc(r.c) + ');background-size:' + (first ? 0 : p) + '% 3px" data-w="' + p + '">' + hgEsc(r.sh) + ' ' + (r.ok ? '✓' : r.v + '/' + r.g) + '</span>'; }).join('') + '</span></span>';
    el.hidden = false;
    if (first) requestAnimationFrame(function () { requestAnimationFrame(function () {   // 처음 그릴 때만 링·막대 차오름
      var fg = el.querySelector('.fg'); if (fg) fg.setAttribute('stroke-dasharray', wp / 100 * C + ' ' + C);
      [].forEach.call(el.querySelectorAll('.hg-c>span'), function (i) { i.style.backgroundSize = i.getAttribute('data-w') + '% 3px'; });
    }); });
  }
  function hgSpot(el) {   // 응원 줄 바로 아래 (응원 줄이 없으면 본문 맨 위)
    var mn = slot(), say = D.getElementById('ryHeatSay'); if (!mn) return;
    if (say && say.parentNode === mn) { if (el.previousSibling !== say) mn.insertBefore(el, say.nextSibling); }
    else if (el.parentNode !== mn) mn.insertBefore(el, mn.firstChild);
  }
  if (typeof window.scQuick === 'function') { var _scq = window.scQuick; window.scQuick = function () { var r = _scq.apply(this, arguments); try { hgRender(); } catch (e) {} return r; }; }

  function all(n) { inline(n); sizePass(n); scRows(n); }
  sheets(); all(D.body); tick(); try { hgRender(); } catch (e) {}
  setInterval(tick, 500); setInterval(function () { try { hgRender(); } catch (e) {} }, 30000);
  var pend = [], q = 0;
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { for (var i = 0; i < m.addedNodes.length; i++) pend.push(m.addedNodes[i]); });
    if (q) return;
    q = requestAnimationFrame(function () { q = 0; var l = pend; pend = []; sheets(); l.forEach(function (n) { if (n.isConnected && n.nodeType === 1) all(n); }); });
  }).observe(D.body, { childList: true, subtree: true });
})();
