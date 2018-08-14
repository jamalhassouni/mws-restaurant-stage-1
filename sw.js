const CACHE_NAME = 'restaurant-app-v1';
const urlsToCache = [
       '/',
       '/index.html',
       '/restaurant.html',
       '/css/styles.css',
       '/js/dbhelper.js',
       '/js/main.js',
       '/js/restaurant_info.js',
       '/data/restaurants.json',
       '/img/',
];
/* add all image to urlsToCache array  */
const makeImageNames = () => {
  const arrayImg = [];

  for (let i = 1; i < 11; i += 1) {
    arrayImg.push(`/img/${i}-200px.webp`);
    arrayImg.push(`/img/${i}-400px.webp`);
    arrayImg.push(`/img/${i}-800px.webp`);
    arrayImg.push(`/img/${i}-200px.jpg`);
    arrayImg.push(`/img/${i}-400px.jpg`);
    arrayImg.push(`/img/${i}-800px.jpg`);
  }
  return arrayImg;
};

urlsToCache.concat(makeImageNames());

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request)
    .then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        return response;
      });
    }));
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['restaurant-app-v1'];

  event.waitUntil(caches.keys().then(cacheNames =>
    Promise.all(cacheNames.map((cacheName) => {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        return caches.delete(cacheName);
      }
    }))));
});
