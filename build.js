// 사용법: node ~/sites/readyyoung/build.js  → 바탕화면의 최신 Index 로 index.html 을 다시 만든다
const fs = require('fs'), path = require('path'), os = require('os');
const SRC = process.argv[2] || path.join(os.homedir(), 'Desktop/레디영물류_배포/2_Index에_붙여넣기.txt');
const dir = __dirname, shim = fs.readFileSync(path.join(dir, 'pages-shim.js'), 'utf8');
if (/<\/script/i.test(shim)) throw new Error('shim 안에 </script 가 있으면 안 돼요');
let html = fs.readFileSync(SRC, 'utf8');
const must = (re, what) => { if (!re.test(html)) throw new Error('Index 에서 ' + what + ' 을(를) 못 찾았어요 — build.js 확인 필요'); };
must(/<head>/, '<head>'); must(/<title>[^<]*<\/title>/, '<title>');
html = html
  .replace(/[ \t]*<link rel="(?:apple-touch-icon|icon)"[^>]*lh3\.googleusercontent\.com[^>]*>\n?/g, '')   // 구글 드라이브 아이콘 → 이 사이트 아이콘
  .replace(/<title>[^<]*<\/title>/, '<title>발주 성수레디영약국</title>')   // 1016 관리약사: 탭이 많아 찾기 어려움 → 탭 이름만 '발주'로 시작
  .replace('<head>', () => '<head>\n  <meta name="ry-build" content="' + Date.now().toString(36) + '">\n  <!-- 1118 카톡 미리보기 (공유 링크) --><meta property="og:type" content="website"><meta property="og:site_name" content="성수레디영"><meta property="og:title" content="성수레디영 물류앱"><meta property="og:description" content="숙지사항 · 발주 · 입고를 한 곳에서 — 눌러서 물류앱으로 바로 열기 (직원 전용)"><meta property="og:image" content="https://deltoy.github.io/readyyoung/ry-icon-512.png"><meta property="og:image:width" content="512"><meta property="og:image:height" content="512"><meta property="og:url" content="https://deltoy.github.io/readyyoung/"><meta name="description" content="성수레디영 물류앱 (직원 전용)">\n  <link rel="manifest" href="manifest.webmanifest?v=ry2"><link rel="apple-touch-icon" href="ry-apple-touch-180.png"><link rel="icon" type="image/png" href="ry-icon-192.png">\n  <script>' + shim + '</script>');
const tmp = path.join(dir, 'index.html.tmp'); fs.writeFileSync(tmp, html); fs.renameSync(tmp, path.join(dir, 'index.html'));
console.log('index.html 만들었어요', Buffer.byteLength(html), 'bytes ←', SRC);
