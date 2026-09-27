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
  .replace(/<title>[^<]*<\/title>/, '<title>성수 레디영 물류센터</title>')
  .replace('<head>', () => '<head>\n  <link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" type="image/png" href="icon-192.png">\n  <script>' + shim + '</script>');
const tmp = path.join(dir, 'index.html.tmp'); fs.writeFileSync(tmp, html); fs.renameSync(tmp, path.join(dir, 'index.html'));
console.log('index.html 만들었어요', Buffer.byteLength(html), 'bytes ←', SRC);
