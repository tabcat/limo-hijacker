const browser = typeof chrome === 'undefined'
  ? global.browser
  : chrome

console.log('here')
browser.webRequest.onErrorOccurred.addListener((details) => {
  console.log('here')
  const resolverUrl = browser.runtime.getURL('resolver.html')
  browser.tabs.update(details.tabId, { url: resolverUrl.toString() + '?' + new URL(details.url).host });
}, {
  urls: ['*://*.eth/*'],
  types: ['main_frame'],
});

browser.webRequest.onHeadersReceived.addListener(
  function(details) {
    for (let header of details.responseHeaders) {
      if (header.name.toLowerCase() === "content-security-policy") {
        header.value = header.value.replace(/frame-ancestors [^;]+/, `frame-ancestors 'self' ${browser.runtime.getURL('')}`);
      }
    }
    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["*://*.eth.limo/*"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "xmlhttprequest", "media", "websocket", "other"]
   },
  ["blocking", "responseHeaders"]
);

// browser.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     console.log(details)
//     // Block the request by returning {cancel: true}
//     return { cancel: true };
//   },
//   {
//     urls: ["*://*.eth.limo/*"],
//     types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "xmlhttprequest", "media", "websocket", "other"]
//   },
//   ["blocking"]
// );


// browser.webRequest.onBeforeRequest.addListener(
//   (details) => {
//   let filter = browser.webRequest.filterResponseData(details.requestId);
//   filter.close()
//      { cancel: true }
//   },
//   { urls: [browser.runtime.getURL('resolver.html'), '*://*.eth.limo/*'], types: ['main_frame', 'sub_frame'] },
//   ['blocking']
// )

// function listener(details) {
//   console.log('called')
//   let filter = browser.webRequest.filterResponseData(details.requestId);
//   let decoder = new TextDecoder("utf-8");
//   let encoder = new TextEncoder();

//   // filter.write(encoder.encode(html))
//   // filter.close()
//   filter.ondata = event => {
//     console.log(event)
//     filter.write(encoder.encode(html2));
//     filter.close();
//   }

//   return { cancel: undefined };
// }

// console.log('here')
// browser.webRequest.onBeforeRequest.addListener(
//   listener,
//   {urls: ["*://*.eth.limo/*"], types: ["main_frame"]},
//   ["blocking"]
// );

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     console.log('here')
//     console.log(details.url)
//     if (details.url.endsWith(".eth.link/")) {
//       console.log('nothere')
//       browser.scripting.executeScript({
//         target: { tabId: details.tabId },
//         func: injectHTML
//       });
//       return { cancel: true };  // Cancel the original request
//     }
//   },
//   { urls: ["*://*.eth.link/*"] },
//   ["blocking"]
// );

// console.log(permissions)

const hello = 'hello world'
const html =
`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Intercepted HTML</title>
  </head>
  <body>
    <h1>This is the HTML document returned by the extension.</h1>
  </body>
  </html>
`

const html2 =
`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fullscreen Iframe</title>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="https://example.com"></iframe>
</body>
</html>

`


// function injectHTML() {
//   document.documentElement.innerHTML = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <title>Intercepted HTML</title>
//     </head>
//     <body>
//       <h1>This is the HTML document returned by the extension.</h1>
//     </body>
//     </html>`;
// }
