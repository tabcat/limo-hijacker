# limo hijacker 🕴️

client-side verifying ENS/IPFS resolver chrome extension

## Disclaimer

I recommend using eth.limo without this extension normally. This project is more of an **art project** and **learning process** for myself.

## How does it work?

1. The extension uses browser.webRequest.onHeadersReceived to edit the frame-ancestor header from *.eth.limo sites.
2. Then whenever the user navigates to a .eth or .eth.limo domain the extension redirects to its own url (web-extension://`extension-id`/resolver.html?`domain`.eth)
3. Resolver.html registers a service worker to intercept traffic to *.eth.limo and adds an iframe the size of the window with src=`domain`.eth.limo
4. When the iframe needs to fetch a resource from `domain`.eth.limo the service worker instead queries an ETH RPC and then an ipfs gateway with a verified fetch to resolve the content.

(still a WIP!)

## The problem

There are a few different ways to view IPFS sites resolved through ENS:

|    | client verified | storage context (per domain) | low friction | aesthetic address |
|----|----------|----------|---|---|
| IPFS Gateway (e.g. dweb.link) |❌|❌|✅|❌|
| ENS Gateway (e.g. eth.limo) |❌|✅|✅|✅|
| eth.local (local DNS/ENS resolver) |✅|✅|❌|✅|
| limo-hijacker |✅|✅|✅|✅| 
| ens+ipfs:// protocol handler (hypothetical) |✅|✅|✅|⭐| 


