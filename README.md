# limo hijacker 🕴️

client-side verifying ENS/IPFS resolver chrome extension

## Disclaimer

This project is more of an **art project** and **learning process** for myself. I recommend using eth.limo without this extension normally.

## How does it work?

The extension:
1. Forwards requests to .eth to .eth.limo
2. Resolves the contenthash of the .eth domain using [@ensdomains/ensjs](https://github.com/ensdomains/ensjs-v3).
3. Replaces data of responses from eth.limo with response data from trustless ipfs gateways using [@helia/verified-fetch](https://github.com/ipfs/helia-verified-fetch/tree/main).

## The problem

There are a few different ways to view IPFS sites resolved through ENS:

|    | client verified | storage context (per domain) | low friction | aesthetic address |
|----|----------|----------|---|---|
| IPFS Gateway (e.g. dweb.link) |❌|❌|✅|❌|
| ENS Gateway (e.g. eth.limo) |❌|✅|✅|✅|
| eth.local (local DNS/ENS resolver) |✅|✅|❌|✅|
| limo-hijacker |✅|✅|✅|✅| 
| ens+ipfs:// protocol handler (hypothetical) |⭐|⭐|⭐|⭐| 

None existing are perfect. The endgame is either extensions being able to handle ens+ipfs:// links or built in browser support.
