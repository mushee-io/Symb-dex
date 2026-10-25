import {getAddress,isAddress} from "viem";
export const dayUtc=(time=Date.now())=>Math.floor(time/86_400_000);
export function claimMessage(wallet,chainId,day) {
 if(!isAddress(wallet??"")||!Number.isSafeInteger(chainId)||chainId<=1000||chainId===4613 ||
   !Number.isSafeInteger(day)||day<0)
   throw new Error("Invalid demo faucet signature request.");
 return [
 "Symb testnet faucet claim",
 "Zero-value test assets only; no real funds.",
 "Chain: "+chainId,
 "Wallet: "+getAddress(wallet),
 "UTC day: "+day,
 "Purpose: authorize an operator to send test tokens to this address only."
 ].join("\n");
}
