/* 1109b 부외품 사장님 페이지(bw.html) 홈 화면 설치 조건용 — 캐시 없이 그대로 통과 (scope ./bw.html 만, 물류앱 index 는 안 건드림) */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () {});
