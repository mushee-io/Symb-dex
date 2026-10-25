import {isAddress,getAddress,zeroAddress} from "viem";
const nonzero=a=>isAddress(a??"")&&getAddress(a)!==zeroAddress;
export const order=Object.freeze(["tUSD","tUSDC","tUSDT","tBTC","tETH","tSYMB"]);
const decimals=Object.freeze([6,6,6,8,18,18]);
export function deploymentAddresses(transactions) {
 if(!Array.isArray(transactions))throw new Error("Missing Foundry broadcast records.");
 // Foundry broadcasts can label subsequent CALL transactions with the same
 // contractName/address. Only contract CREATION records represent deployments.
 const find=name=>transactions.filter(x=>x.contractName===name &&
  ["CREATE","CREATE2"].includes(x.transactionType) && nonzero(x.contractAddress));
 const singular={};
 for(const name of ["SymbFactory","SymbRouter","SymbWrappedVery","SymbTestFaucet"]) {
  const match=find(name);
  if(match.length!==1)throw new Error("Expected exactly one deployed "+name+" address.");
  singular[name]=getAddress(match[0].contractAddress);
 }
 const advanced=["SymbDemoTokenFactory","SymbDemoLimitBook"];
 const found=advanced.map(find);
 if(found.some(a=>a.length)&&found.some(a=>a.length!==1))throw new Error("Partial or duplicate advanced testnet deployment.");
 const tokens=find("SymbTestToken");
 if(tokens.length!==6)throw new Error("Expected six sequential test token deployments.");
 const vals={factory:singular.SymbFactory,router:singular.SymbRouter,
  wrappedTestNative:singular.SymbWrappedVery,faucet:singular.SymbTestFaucet,
  tokens:tokens.map((t,i)=>({symbol:order[i],decimals:decimals[i],
   address:getAddress(t.contractAddress),verifiedDemo:true}))};
 if(found.every(a=>a.length===1)){
  vals.tokenCreator=getAddress(found[0][0].contractAddress);
  vals.limitBook=getAddress(found[1][0].contractAddress);
 }
 const addresses=[vals.factory,vals.router,vals.wrappedTestNative,vals.faucet,...vals.tokens.map(x=>x.address),...(vals.tokenCreator?[vals.tokenCreator,vals.limitBook]:[])];
 if(new Set(addresses.map(a=>a.toLowerCase())).size!==addresses.length)
  throw new Error("Deployed addresses overlap.");
 return vals;
}
