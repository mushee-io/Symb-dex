import {defineChain,type Chain} from "viem";
import network from "@/config/networks.testnet.json";
import deployment from "@/config/deployments.testnet.json";
import {validateTestnet} from "@/lib/testnet/config.mjs";

export type DemoToken={symbol:string;address:`0x${string}`;decimals:number;verifiedDemo:true};
export type DemoDeployment={
 chainId:number;factory:`0x${string}`;router:`0x${string}`;
 wrappedTestNative:`0x${string}`;faucet:`0x${string}`;
 tokens:DemoToken[];feeBps:number;realFundsAllowed:false;
 tokenCreator?:`0x${string}`|null;limitBook?:`0x${string}`|null;
};
export type DemoNetwork={
 chainId:number;rpcUrl:string;explorerUrl:string;name:string;
 nativeCurrency:{name:string;symbol:string;decimals:18};
 isOfficialVeryTestnet:boolean;realFundsAllowed:false;
};
const verdict=validateTestnet({network,deployments:deployment});
export const testnetConfigurationIssues=verdict.errors;
export const testnetReady=verdict.ready && deployment.feeBps===30;
export const demoNetwork=testnetReady?network as unknown as DemoNetwork:null;
export const demoDeployment=testnetReady?deployment as unknown as DemoDeployment:null;
export const demoChain:Chain|null=demoNetwork ? defineChain({
 id:demoNetwork.chainId,
 name:demoNetwork.name,
 nativeCurrency:demoNetwork.nativeCurrency,
 rpcUrls:{default:{http:[demoNetwork.rpcUrl]}},
 blockExplorers:{default:{name:"Lidde Test Explorer",url:demoNetwork.explorerUrl}},
 testnet:true,
}):null;
