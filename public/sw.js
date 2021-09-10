var CACHE_NAME = 'pwa-news';
var urlsToCache = [
    '/',
    '/index.html'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache')
                return cache.addAll(urlsToCache)
            })
    )
})

self.addEventListener('active', event => {
    var cacheWhiteList = ['pwa-task-manager']
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheWhiteList.indexOf(cacheName) === 1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})

self.addEventListener('fetch', function(event) {
    console.log('fetch', event.url)
    
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }))
    )
})