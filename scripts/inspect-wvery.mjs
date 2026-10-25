// Read-only VERY wrapper candidate inspector. Does not make canonicality claims.
import {createPublicClient,http,erc20Abi,getAddress,isAddress,zeroAddress} from "viem";
import {readFile} from "node:fs/promises";
import {assessWrapper} from "../lib/wrapper-assessment.mjs";

const chain=JSON.parse(await readFile(new URL("../config/very-mainnet.json",import.meta.url),"utf8"));
const candidate=process.env.SYMB_WVERY_CANDIDATE;
if(!isAddress(candidate??"") || getAddress(candidate)===zeroAddress) {
  console.error("Provide SYMB_WVERY_CANDIDATE=<exact contract address>; no default is trusted.");
  process.exitCode=1;
} else {
  try {
    const client=createPublicClient({transport:http(chain.rpcUrl,{timeout:20000,retryCount:1})});
    if(await client.getChainId()!==4613) throw new Error("RPC chain ID mismatch");
    const address=getAddress(candidate);
    const atBlock=await client.getBlockNumber();
    const code=await client.getBytecode({address,blockNumber:atBlock});
    if(!code || code==="0x") throw new Error("Address has no deployed smart-contract code; do not configure for Symb.");
    const [name,symbol,decimals,supply,nativeBalance]=await Promise.all([
      client.readContract({address,abi:erc20Abi,functionName:"name",blockNumber:atBlock}),
      client.readContract({address,abi:erc20Abi,functionName:"symbol",blockNumber:atBlock}),
      client.readContract({address,abi:erc20Abi,functionName:"decimals",blockNumber:atBlock}),
      client.readContract({address,abi:erc20Abi,functionName:"totalSupply",blockNumber:atBlock}),
      client.getBalance({address,blockNumber:atBlock}),
    ]);
    const assessment=assessWrapper({code,name,symbol,decimals,supply,nativeBalance});
    console.log(JSON.stringify({network:"VERY Mainnet",chainId:4613,address,block:atBlock.toString(),
      codeSizeBytes:(code.length-2)/2,name,symbol,decimals,supply:supply.toString(),
      nativeBalance:nativeBalance.toString(),...assessment},null,2));
    console.log("This is NOT an official-issuer verification or approval for trading.");
    if(!assessment.checksPassed)process.exitCode=1;
  } catch(e) {
    console.error("Candidate probe failed (no on-chain state was changed):",e instanceof Error?e.message:String(e));
    process.exitCode=1;
  }
}
