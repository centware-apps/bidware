/* BidWare offline helper. Tries the network first so updates arrive, falls back to the saved copy offline. */
var V = 'bidware-v1';
var FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './favicon-64.png', './jspdf.umd.min.js'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var u = new URL(e.request.url); if(u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function(r){ var c = r.clone(); caches.open(V).then(function(x){ x.put(e.request, c); }); return r; })
    .catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match('./index.html'); }); }));
});
