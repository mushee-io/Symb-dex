import {isAddress,getAddress,zeroAddress} from "viem";
const nonzero=a=>isAddress(a??"")&&getAddress(a)!==zeroAddress;
export const order=Object.freeze(["tUSD","tUSDC","tUSDT","tBTC","tETH","tLIDDE"]);
const decimals=Object.freeze([6,6,6,8,18,18]);
export function deploymentAddresses(transactions) {
 if(!Array.isArray(transactions))throw new Error("Missing Foundry broadcast records.");
 // Foundry broadcasts can label subsequent CALL transactions with the same
 // contractName/address. Only contract CREATION records represent deployments.
 const find=name=>transactions.filter(x=>x.contractName===name &&
  ["CREATE","CREATE2"].includes(x.transactionType) && nonzero(x.contractAddress));
 const singular={};
 for(const name of ["LiddeFactory","LiddeRouter","LiddeWrappedVery","LiddeTestFaucet"]) {
  const match=find(name);
  if(match.length!==1)throw new Error("Expected exactly one deployed "+name+" address.");
  singular[name]=getAddress(match[0].contractAddress);
 }
 const tokens=find("LiddeTestToken");
 if(tokens.length!==6)throw new Error("Expected six sequential test token deployments.");
 const vals={factory:singular.LiddeFactory,router:singular.LiddeRouter,
  wrappedTestNative:singular.LiddeWrappedVery,faucet:singular.LiddeTestFaucet,
  tokens:tokens.map((t,i)=>({symbol:order[i],decimals:decimals[i],
   address:getAddress(t.contractAddress),verifiedDemo:true}))};
 const addresses=[vals.factory,vals.router,vals.wrappedTestNative,vals.faucet,...vals.tokens.map(x=>x.address)];
 if(new Set(addresses.map(a=>a.toLowerCase())).size!==addresses.length)
  throw new Error("Deployed addresses overlap.");
 return vals;
}
