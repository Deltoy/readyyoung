/* 1109 MJ "2·3·4·5 적용" — 화면 정돈 덧씌우기 (문준 화면에만, pages-shim 이 불러옴 · 끄기 ?unslop=0 / 켜기 ?unslop=1)
   ② 글씨 크기 10단계·굵기 600 이하  ③ 회색 10단계(밝기차 ≤18만)·진한 파랑/보라 → #155EEF
   ④ 큰 요소 알약(999px·50%) → 10px  ⑤ 홀수 px 간격 → 짝수.  ① 이모지→아이콘은 MJ 가 뺌. 원본은 _unslop_preview.js */
(function () {
  if (window.__unslop) return; window.__unslop = 1;
  var SIZES = [11, 12, 13, 14, 16, 18, 20, 24, 28, 32];
  var snapSize = function (px) { return SIZES.reduce(function (a, b) { return Math.abs(b - px) < Math.abs(a - px) ? b : a; }); };
  var GRAYS = ['#101828', '#344054', '#475467', '#667085', '#98A2B3', '#D0D5DD', '#E4E7EC', '#F2F4F7', '#F9FAFB', '#FFFFFF'];
  var rgb = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); };
  var lum = function (c) { return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; };
  var GL = GRAYS.map(function (g) { return lum(rgb(g)); });
  function snapColor(hex) {
    var h = hex.length === 4 ? '#' + hex.slice(1).split('').map(function (x) { return x + x; }).join('') : hex;
    if (h.length !== 7) return hex;
    var c = rgb(h), mx = Math.max.apply(0, c), mn = Math.min.apply(0, c), sat = mx ? (mx - mn) / mx : 0;
    if (sat < 0.12) { var L = lum(c), i = 0; GL.forEach(function (g, k) { if (Math.abs(g - L) < Math.abs(GL[i] - L)) i = k; }); return Math.abs(GL[i] - L) <= 18 ? GRAYS[i] : hex; }
    if (c[2] > c[1] + 20 && c[2] > c[0] - 30 && lum(c) < 170) return '#155EEF';   /* 빨강·초록·노랑(상태 색)은 그대로 */
    return hex;
  }
  var PILL_KEEP = /dot|badge|chip|pill|avatar|toggle|switch|knob|count|tag|spin|loader|circle|round|radio|check|dz-|us-/i;
  var PAD = ['padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'margin-top', 'margin-bottom', 'gap', 'row-gap', 'column-gap'];
  var COL = ['color', 'background-color', 'border-color', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color'];
  function fixDecl(st, sel) {
    var pr = function (p) { return st.getPropertyPriority(p); };
    var fs = st.getPropertyValue('font-size'); if (/px$/.test(fs)) { var v = parseFloat(fs); if (v >= 9 && v <= 34) st.setProperty('font-size', snapSize(v) + 'px', pr('font-size')); }
    if (+st.getPropertyValue('font-weight') >= 700) st.setProperty('font-weight', '600', pr('font-weight'));
    COL.forEach(function (p) { var v = st.getPropertyValue(p).trim(); if (/^#[0-9a-f]{3,6}$/i.test(v)) st.setProperty(p, snapColor(v), pr(p)); });
    var br = st.getPropertyValue('border-radius').trim(); if (/^(999|9999|100)px$|^50%$/.test(br) && sel !== null && !PILL_KEEP.test(sel)) st.setProperty('border-radius', '10px', pr('border-radius'));
    PAD.forEach(function (p) { var v = st.getPropertyValue(p); if (/^\d+px$/.test(v)) { var n = parseInt(v, 10); if (n > 2 && n % 2) st.setProperty(p, (n + 1) + 'px', pr(p)); } });
  }
  function walk(rules) { for (var i = 0; i < rules.length; i++) { var r = rules[i]; try { if (r.style) fixDecl(r.style, r.selectorText || ''); if (r.cssRules) walk(r.cssRules); } catch (e) {} } }
  function sheets() { for (var i = 0; i < document.styleSheets.length; i++) { var s = document.styleSheets[i]; if (s.__us) continue; try { walk(s.cssRules); s.__us = 1; } catch (e) {} } }
  function inline1(el) {
    if (!el.getAttribute) return;
    var s = el.getAttribute('style'); if (!s) return;
    var cls = (typeof el.className === 'string' ? el.className : '') + ' ' + el.tagName;
    var big = /border-radius:\s*(999|9999|100)px|border-radius:\s*50%/.test(s) && el.offsetHeight > 30;
    fixDecl(el.style, big ? cls : null);
  }
  function inline(root) { if (root.nodeType !== 1) return; inline1(root); var l = root.querySelectorAll('[style]'); for (var i = 0; i < l.length; i++) inline1(l[i]); }
  sheets(); inline(document.body);
  /* ponytail: 새로 붙은 노드만 봄 — JS 가 나중에 style 속성만 바꾸는 건 안 잡힘(필요하면 attributes 관찰 추가) */
  var pend = [], q = 0;
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { for (var i = 0; i < m.addedNodes.length; i++) pend.push(m.addedNodes[i]); });
    if (q) return;
    q = requestAnimationFrame(function () { q = 0; var l = pend; pend = []; sheets(); l.forEach(function (n) { if (n.isConnected) inline(n); }); });
  }).observe(document.body, { childList: true, subtree: true });
})();
