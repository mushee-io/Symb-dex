import { decodeEventLog, parseAbi, getAddress, isAddress, zeroAddress } from "viem";

export const factoryEvents = parseAbi([
  "event PairCreated(address indexed token0,address indexed token1,address pair,uint256)"
]);
export const pairEvents = parseAbi([
  "event Mint(address indexed sender,uint256 amount0,uint256 amount1)",
  "event Burn(address indexed sender,uint256 amount0,uint256 amount1,address indexed to)",
  "event Swap(address indexed sender,uint256 amount0In,uint256 amount1In,uint256 amount0Out,uint256 amount1Out,address indexed to)",
  "event Sync(uint112 reserve0,uint112 reserve1)",
  "event Transfer(address indexed from,address indexed to,uint256 value)"
]);
export const factoryReadAbi=parseAbi([
  "function getPair(address,address) view returns (address)"
]);
export const pairReadAbi=parseAbi([
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112,uint112,uint32)",
  "function totalSupply() view returns (uint256)"
]);

export const validAddress=value=>isAddress(value||"") && getAddress(value)!==zeroAddress;
export function parsePairCreation(log,factory) {
  if(!validAddress(factory) || log.address?.toLowerCase()!==factory.toLowerCase())
    throw new Error("Factory event emitted by unexpected contract.");
  const decoded=decodeEventLog({abi:factoryEvents,data:log.data,topics:log.topics,strict:true});
  if(decoded.eventName!=="PairCreated") throw new Error("Unexpected factory event.");
  const {token0,token1,pair}=decoded.args;
  if(!validAddress(token0)||!validAddress(token1)||!validAddress(pair)||
     token0.toLowerCase()===token1.toLowerCase()) throw new Error("Invalid PairCreated addresses.");
  return {
    address:getAddress(pair),token0:getAddress(token0),token1:getAddress(token1),
    creationBlock:BigInt(log.blockNumber),transactionHash:log.transactionHash,
    logIndex:Number(log.logIndex)
  };
}
export function normalizePairLog(log,pairSet,headerByNumber) {
  if(!pairSet.has(log.address?.toLowerCase())) throw new Error("Unregistered pair event.");
  const blockNumber=BigInt(log.blockNumber);
  const header=headerByNumber.get(blockNumber.toString());
  if(!header || header.hash.toLowerCase()!==log.blockHash?.toLowerCase())
    throw new Error("Log block hash does not match downloaded canonical block.");
  if(!/^0x[a-fA-F0-9]{64}$/.test(log.transactionHash||"") ||
     !Number.isSafeInteger(Number(log.logIndex)) || Number(log.logIndex)<0)
    throw new Error("Malformed transaction event identity.");
  const event=decodeEventLog({abi:pairEvents,data:log.data,topics:log.topics,strict:true});
  const a=event.args;
  const payload=Object.fromEntries(Object.entries(a).map(([k,v])=>[k,typeof v==="bigint"?v.toString():v]));
  return {
    pair:log.address.toLowerCase(),blockNumber,blockHash:log.blockHash.toLowerCase(),
    transactionHash:log.transactionHash.toLowerCase(),logIndex:Number(log.logIndex),
    eventName:event.eventName,args:payload,
  };
}
export function normalizedAmounts(event) {
  const a=event.args;
  const bigint=(value)=>{if(typeof value!=="string" || !/^\d+$/.test(value)) throw new Error("Invalid uint256 event value.");return value;};
  switch(event.eventName) {
    case "Swap": return {kind:"swap",amount0In:bigint(a.amount0In),amount1In:bigint(a.amount1In),
      amount0Out:bigint(a.amount0Out),amount1Out:bigint(a.amount1Out),sender:a.sender,to:a.to};
    case "Mint":return {kind:"mint",amount0:bigint(a.amount0),amount1:bigint(a.amount1),sender:a.sender,to:null};
    case "Burn":return {kind:"burn",amount0:bigint(a.amount0),amount1:bigint(a.amount1),sender:a.sender,to:a.to};
    case "Sync":return {kind:"sync",reserve0:bigint(a.reserve0),reserve1:bigint(a.reserve1)};
    case "Transfer":return {kind:"transfer",from:a.from,to:a.to,value:bigint(a.value)};
    default:throw new Error("Unsupported pair event.");
  }
}
