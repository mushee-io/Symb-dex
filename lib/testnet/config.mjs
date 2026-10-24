import {isAddress,getAddress,zeroAddress} from "viem";
export const DEMO_TOKEN_SYMBOLS = Object.freeze(["tUSD","tUSDC","tUSDT","tBTC","tETH","tLIDDE"]);
const valid = value => isAddress(value??"") && getAddress(value)!==zeroAddress;
const url=(value)=>{try {const u=new URL(value);return u.protocol==="https:" || (u.protocol==="http:" && ["localhost","127.0.0.1","::1"].includes(u.hostname));}catch{return false;}};
const same=(a,b)=>a.toLowerCase()===b.toLowerCase();
export function validateTestnet({network,deployments}) {
 const errors=[];
 const chain=network?.chainId;
 if(!Number.isSafeInteger(chain)||chain<=1000 || [1,4613,5,11155111].includes(chain))
   errors.push("A unique valid non-mainnet chain ID is required.");
 if(network?.status!=="configured" || deployments?.status!=="configured" )
   errors.push("Network and contract registry must both be explicitly configured.");
 if(network?.realFundsAllowed!==false || deployments?.realFundsAllowed!==false)
   errors.push("Testnet must expressly disallow real funds.");
 if(!url(network?.rpcUrl)||!url(network?.explorerUrl))
   errors.push("RPC and explorer must be configured HTTPS (HTTP only for local loopback).");
 if(!network?.nativeCurrency || network.nativeCurrency.symbol!=="tVERY" ||
    network.nativeCurrency.decimals!==18)
   errors.push("Native gas token must be explicitly labelled tVERY.");
 if(deployments?.chainId!==chain) errors.push("Network and contract deployment chain IDs differ.");
 const addresses=[deployments?.factory,deployments?.router,deployments?.wrappedTestNative,deployments?.faucet];
 if(!addresses.every(valid))errors.push("Factory, Router, wrapped test-native and faucet addresses required.");
 const tokens=deployments?.tokens;
 if(!Array.isArray(tokens)||tokens.length!==DEMO_TOKEN_SYMBOLS.length)
   errors.push("Six expected demo tokens required.");
 else {
  const names=new Set();
  for(const t of tokens) {
   if(!valid(t.address)||!DEMO_TOKEN_SYMBOLS.includes(t.symbol)||names.has(t.symbol)||
      !([6,8,18].includes(t.decimals)) || t.verifiedDemo!==true)
     errors.push("Token registry includes malformed, duplicate or unverified demo asset.");
   names.add(t.symbol);
  }
  if(names.size!==DEMO_TOKEN_SYMBOLS.length)errors.push("Every expected demo token is required.");
 }
 const all=[...addresses,...(Array.isArray(tokens)?tokens.map(t=>t.address):[])];
 if(all.every(valid)&&new Set(all.map(a=>a.toLowerCase())).size!==all.length)
   errors.push("Contract addresses may not overlap.");
 if(network?.isOfficialVeryTestnet===true && !network?.officialVerificationReference)
   errors.push("Do not claim official VERY testnet status without attributable official reference.");
 return {ready:errors.length===0,errors,chainId:chain??null};
}
