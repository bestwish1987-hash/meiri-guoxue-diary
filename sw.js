// 每日國學日記 — Service Worker（app shell 離線快取）
// 改版重點：導覽走 network-first（有網路就拿最新，離線才用快取）→ 更新不再被舊快取卡住
const VER = "guoxue-v2";
const CORE = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const isNav = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isNav) {
    // network-first：拿最新 index.html，離線才回退快取
    e.respondWith(
      fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(VER).then(c => c.put("./index.html", copy)).catch(() => {});
        return resp;
      }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
  } else {
    // 其他資源 stale-while-revalidate：先給快取、背景更新
    e.respondWith(
      caches.match(req).then(cached => {
        const net = fetch(req).then(resp => {
          const copy = resp.clone();
          caches.open(VER).then(c => c.put(req, copy)).catch(() => {});
          return resp;
        }).catch(() => cached);
        return cached || net;
      })
    );
  }
});
