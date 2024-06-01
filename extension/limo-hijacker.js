self.addEventListener('fetch', event => {
  console.log(event)
//   const url = new URL(event.request.url);

//   console.log(event.request.url)
//   // Check if the request is to a `.limo` TLD
//   // if (url.hostname.endsWith('.limo')) {
//       // Respond with a custom response
      event.respondWith(
new Response('Hello', {
    status: 200,
    statusText: 'OK',
    headers: {
        'Content-Type': 'text/plain'
    }
})
      );
//   } else {
//       // Let the request pass through for other domains
//       event.respondWith(fetch(event.request));
//   }
});
