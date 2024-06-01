if ('serviceWorker' in navigator) {
  const browser = typeof chrome === 'undefined'
    ? global.browser
    : chrome

    navigator.serviceWorker.register(browser.runtime.getURL('limo-hijacker.js'))
    .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
                const iframe = document.createElement('iframe');
                iframe.src = `https://${window.location.search.slice(1)}.limo`;
                console.log(iframe)
                document.body.appendChild(iframe);
    })
    .catch(function(error) {
        console.error('Service Worker registration failed:', error);
    });
} else {
    console.error('Service Workers are not supported in this browser.');
}
