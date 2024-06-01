import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'
// import { fileTypeFromBuffer } from '@sgtpooki/file-type'
import { trustlessGateway } from '@helia/block-brokers'
import { createHeliaHTTP } from '@helia/http'
import { delegatedHTTPRouting, httpGatewayRouting } from '@helia/routers'
import { createVerifiedFetch } from '@helia/verified-fetch'

const ipfsProtostring = 'ipfs://'

async function startup () {
  window.ens = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
  })

  window.vf = await createVerifiedFetch(
    await createHeliaHTTP({
      blockBrokers: [
        trustlessGateway()
      ],
      routers: [
        delegatedHTTPRouting('http://delegated-ipfs.dev'),
        httpGatewayRouting({
          gateways: ['https://trustless-gateway.link']
        })
      ]
    })
  )
}
startup()

const browser = typeof chrome === 'undefined'
  ? window.browser
  : chrome

const ens_cache = new Map()

/**
 * intercept webRequests to .eth and forward them to limo-hijacker
 */
// browser.webRequest.onErrorOccurred.addListener((details) => {
//   console.log('here')
//   const resolverUrl = browser.runtime.getURL('resolver.html')
//   browser.tabs.update(details.tabId, { url: resolverUrl.toString() + '?' + new URL(details.url).host });
// }, {
//   urls: ['*://*.eth/*'],
//   types: ['main_frame'],
// });


async function resolveContent (ethlimoDomainPath) {
  ethlimoDomainPath = new URL(ethlimoDomainPath)
  console.log(ethlimoDomainPath)
  const ethDomainPath = ethlimoDomainPath.hostname.slice(0, -'.limo'.length)
  let { protocolType, decoded } = ens_cache.get(ethlimoDomainPath) ?? await ens.getContentHashRecord({ name: ethDomainPath })

  if (protocolType === 'ipns') {
    return new Response('no ipns support yet')
  }

  const fullContentPath = ipfsProtostring + decoded.toString() + ethlimoDomainPath.pathname + '/' + ethlimoDomainPath.search

  console.log(fullContentPath)

  return vf(fullContentPath)
}

/**
 * intercept webRequests to .eth.limo and forward them to limo-hijacker
 */
function listener(details) {
  console.log(details.url)
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let encoder = new TextEncoder();

  const verifiedResponse = resolveContent(details.url)

  filter.onstart = event => {
    verifiedResponse.then(async (response) => {
      filter.write(await response.arrayBuffer())
      filter.close()
    })
  }

  // throw away response from eth.limo
  filter.ondata = () => {}

  return { canceled: false };
}
browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["*://*.eth.limo/*"],
    types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "xmlhttprequest", "media", "websocket", "other"]
},
  ["blocking"]
);

/**
 * Edit headers recieved from eth.limo to allow for it to be framed in browser
 */
// browser.webRequest.onHeadersReceived.addListener(
//   function(details) {
//     for (let header of details.responseHeaders) {
//       if (header.name.toLowerCase() === "content-security-policy") {
//         header.value = header.value.replace(/frame-ancestors [^;]+/, `frame-ancestors 'self' ${browser.runtime.getURL('')}`);
//       }
//     }
//     return { responseHeaders: details.responseHeaders };
//   },
//   { urls: ["*://*.eth.limo/*"],
//     types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "xmlhttprequest", "media", "websocket", "other"]
//    },
//   ["blocking", "responseHeaders"]
// );

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
