import {createConfig,http} from "wagmi";
import {injected,walletConnect} from "wagmi/connectors";
import type {Chain} from "viem";
import {very} from "@/lib/very";
import {demoChain,demoNetwork} from "@/lib/testnet/network";

const walletConnectProjectId=process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();
const chains:readonly [Chain,...Chain[]]=demoChain?[very,demoChain]:[very];
const transports = demoChain && demoNetwork
 ?{[very.id]:http(very.rpcUrls.default.http[0],{timeout:12_000,retryCount:2}),
   [demoChain.id]:http(demoNetwork.rpcUrl,{timeout:12_000,retryCount:2})}
 :{[very.id]:http(very.rpcUrls.default.http[0],{timeout:12_000,retryCount:2})};

export const wagmiConfig=createConfig({
 chains,
 multiInjectedProviderDiscovery:true,
 ssr:true,
 connectors:[
  injected({shimDisconnect:true}),
  ...(walletConnectProjectId?[walletConnect({projectId:walletConnectProjectId,showQrModal:true})]:[]),
 ],
 transports,
});
export const isWalletConnectConfigured=Boolean(walletConnectProjectId);
