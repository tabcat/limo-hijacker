import { http } from "viem";
import { mainnet } from "viem/chains";
import { createEnsPublicClient } from "@ensdomains/ensjs";
import { trustlessGateway } from "@helia/block-brokers";
import { createHeliaHTTP } from "@helia/http";
import { delegatedHTTPRouting, httpGatewayRouting } from "@helia/routers";
// import { ipns as heliaIpns } from "@helia/ipns";
import { createVerifiedFetch } from "@helia/verified-fetch";
// import { peerIdFromString } from "@libp2p/peer-id";


const browser = typeof chrome === "undefined" ? window.browser : chrome;

let verifiedFetch
async function setVerifiedFetch() {
  verifiedFetch = await createVerifiedFetch(
    await createHeliaHTTP({
      blockBrokers: [trustlessGateway()],
      routers: [
        delegatedHTTPRouting("http://delegated-ipfs.dev"),
        httpGatewayRouting({
          gateways: ["https://trustless-gateway.link"],
        }),
      ],
    })
  );
}
setVerifiedFetch();

const ensClient = createEnsPublicClient({
  chain: mainnet,
  transport: http(),
});

const ensCache = new Map();
// const ipnsCache = new Map();

async function resolveContent(ethlimoDomainPath) {
  ethlimoDomainPath = new URL(ethlimoDomainPath);

  const ethDomainPath = ethlimoDomainPath.hostname.slice(0, -".limo".length);
  let { protocolType, decoded } =
    ensCache.get(ethlimoDomainPath) ??
    (await ensClient.getContentHashRecord({ name: ethDomainPath }));

  ensCache.set(ethDomainPath, { protocolType, decoded });

  if (protocolType !== "ipfs" && protocolType !== "ipns") {
    return new Response("unsupported protocol type: " + protocolType);
  }

  if (protocolType === "ipns") {
    return new Response("unsupported protocol type: " + protocolType);
    // const result =
    //   ipnsCache.get(decoded) ?? (await ipns.resolve(peerIdFromString(decoded)));

    // console.log(result);
    // ipnsCache.set(decoded, result);

    // protocolType = "ipfs";
    // decoded = result.cid.toV1().toString();
  }

  const fullContentPath = `${protocolType}://${decoded}${ethlimoDomainPath.pathname}`;

  console.log(fullContentPath);

  return verifiedFetch(fullContentPath);
}

/**
 * Resolve ens domain to content hash and replace responses from eth.limo with a trustless ipfs gateway
 */
function hijack(details) {
  console.log(details.url);
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let encoder = new TextEncoder();

  const verifiedResponse = resolveContent(details.url);

  filter.onstart = (event) => {
    verifiedResponse.then(async (response) => {
      console.log("resolve");
      console.log(response)
      filter.write(await response.arrayBuffer());
      filter.close();
    });
  };

  // throw away response from eth.limo
  filter.ondata = () => {};

  return { canceled: false };
}
browser.webRequest.onBeforeRequest.addListener(
  hijack,
  {
    urls: ["*://*.eth.limo/*"],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "xmlhttprequest",
      "media",
      "other",
    ],
  },
  ["blocking"]
);
