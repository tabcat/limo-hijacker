# limo hijacker 🕴️

client-side verifying ENS/IPFS resolver firefox extension

## Disclaimer

This project is more of an **art project** and **learning process** for myself. I recommend using eth.limo without this extension normally.

⚠️ **Only working in Firefox as it relies on [webRequest.filterResponseData](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData).** ⚠️

## How does it work?

The extension:
1. Intercepts requests to eth.limo
2. Resolves the contenthash field of the .eth domain being visited via [@ensdomains/ensjs](https://github.com/ensdomains/ensjs-v3).
3. Replaces data of responses from eth.limo with response data from a trustless ipfs gateway using [@helia/verified-fetch](https://github.com/ipfs/helia-verified-fetch/tree/main).

## The problem

There are a few different ways to view IPFS sites resolved through ENS:

|    | client verified | storage context (per domain) | low friction | aesthetic address |
|----|----------|----------|---|---|
| IPFS Gateway (e.g. dweb.link) |❌|❌|✅|❌|
| ENS Gateway (e.g. eth.limo) |❌|✅|✅|✅|
| eth.local (local DNS/ENS resolver) |✅|✅|❌|✅|
| limo-hijacker |☑️|✅|✅|✅| 
| ens+ipfs:// protocol handler (hypothetical) |⭐|⭐|⭐|⭐| 

☑️: IPNS/IPFS resolutions are verified locally on the client, however the ENS resolutions are not.

None existing are perfect.

The endgame is either extensions being able to handle ens+ipfs:// links or built in browser support.
This will allow resolving web content without needing to interact with any trusted third-parties or systems that use them.

## Prerequisits

[`pnpm`](https://pnpm.io/)

[`web-ext`](https://www.npmjs.com/package/web-ext) (installed globally)

## Build

```bash
pnpm install
pnpm build
```

## Dev server

```bash
web-ext run --source-dir . --devtools
```

For some reason this command has issues when ran from inside of an npm script.
