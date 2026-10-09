// 사용법: node ~/sites/readyyoung/edu_embed.js && node ~/sites/readyyoung/build.js
// 바탕화면 JSON → 바탕화면 Index 소스(2_Index에_붙여넣기.txt)의 <script type="application/json" id="..."> 내용을 새로 바꾼다.
//   eduCompare  ← edu_compare_1010.json          (성분 계열 비교표)
//   eduInteract ← edu_interact_glossary_1010.json (같이 먹으면 안 되는 조합 · 통역 단어장)
//   eduStory    ← edu_story_1010.json             (오늘의 성분 — 파일이 없으면 빈 목록 → 화면에서 카드 숨김)
// 태그가 없으면 eduGuideProds 태그 바로 뒤에 새로 넣는다. 소스는 덮어쓰기 전에 .bak 으로 한 번 남긴다.
const fs = require('fs'), path = require('path'), os = require('os');
const DIR = path.join(os.homedir(), 'Desktop/레디영물류_배포'), SRC = process.argv[2] || path.join(DIR, '2_Index에_붙여넣기.txt');
const MAP = [['eduCompare', 'edu_compare_1010.json'], ['eduInteract', 'edu_interact_glossary_1010.json'], ['eduStory', 'edu_story_1010.json']];
let s = fs.readFileSync(SRC, 'utf8'); const before = s;
for (const [id, file] of MAP) {
  const f = path.join(DIR, file);
  let data;
  if (fs.existsSync(f)) data = JSON.parse(fs.readFileSync(f, 'utf8'));   // 깨진 JSON 이면 여기서 멈춤 (소스는 그대로)
  else if (id === 'eduStory') data = { version: '', items: [] };
  else throw new Error(file + ' 이 없어요');
  const tag = '<script type="application/json" id="' + id + '">' + JSON.stringify(data).replace(/<\//g, '<\\/') + '</script>';
  const re = new RegExp('<script type="application/json" id="' + id + '">[\\s\\S]*?</script>');
  if (re.test(s)) s = s.replace(re, () => tag);
  else {
    const anchor = s.match(/<script type="application\/json" id="eduGuideProds">[\s\S]*?<\/script>/);
    if (!anchor) throw new Error('eduGuideProds 태그를 못 찾았어요');
    s = s.replace(anchor[0], () => anchor[0] + '\n' + tag);
  }
  console.log(id, '←', file, Array.isArray(data.items) ? data.items.length + '개' : (data.tables ? data.tables.length + '표' : '') + (data.interactions ? ' 조합 ' + data.interactions.length + ' · 단어 ' + (data.glossary || []).length : ''));
}
if (s !== before) { fs.writeFileSync(SRC + '.bak', before); const tmp = SRC + '.tmp'; fs.writeFileSync(tmp, s); fs.renameSync(tmp, SRC); console.log('소스를 고쳤어요 →', SRC); }
else console.log('바뀐 게 없어요');
