// Pure, deterministic chain-planning helpers. No RPC or database dependencies.
export const DEFAULT_CONFIRMATIONS = 12;
export const MAX_REORG_DEPTH = 128;
export const MAX_BLOCK_BATCH = 200;

export function confirmedHead(head, confirmations = DEFAULT_CONFIRMATIONS) {
  if (typeof head !== "bigint" || head < 0n || !Number.isInteger(confirmations) || confirmations < 1 || confirmations > 256)
    throw new Error("Invalid chain head or confirmation count.");
  return head >= BigInt(confirmations) ? head - BigInt(confirmations) : null;
}

export function nextWindow({checkpoint, ancestor, deploymentStart, confirmed, batchSize = MAX_BLOCK_BATCH}) {
  if (![deploymentStart,confirmed].every(v=>typeof v==="bigint" && v>=0n) ||
      !Number.isInteger(batchSize) || batchSize<1 || batchSize>MAX_BLOCK_BATCH)
    throw new Error("Invalid backfill window.");
  const from = (ancestor ?? checkpoint?.blockNumber ?? (deploymentStart-1n)) + 1n;
  const begin = from < deploymentStart ? deploymentStart : from;
  if (begin>confirmed) return null;
  const end=begin+BigInt(batchSize)-1n;
  return {from:begin,to:end<confirmed?end:confirmed};
}

export async function findCanonicalAncestor(checkpoint, stored, readBlock, maxDepth=MAX_REORG_DEPTH) {
  if (!checkpoint) return null;
  if (!Number.isInteger(maxDepth) || maxDepth<1 || maxDepth>4096) throw new Error("Invalid reorg safety depth.");
  // Candidates must come from the indexed DB, not from untrusted RPC guesses.
  const records=[checkpoint,...stored].filter(x=>x && typeof x.blockHash==="string");
  const unique=new Set();
  for(const candidate of records) {
    const height=BigInt(candidate.blockNumber);
    if(unique.has(height.toString()) || BigInt(checkpoint.blockNumber)-height>BigInt(maxDepth)) continue;
    unique.add(height.toString());
    const live=await readBlock(height);
    if(live && live.hash?.toLowerCase()===candidate.blockHash.toLowerCase()) return height;
  }
  throw new Error("Canonical ancestor not found within retained reorg window. Halt and reconcile manually.");
}

export function assertHeaderContinuity(headers, priorHash=null) {
  for(let i=0;i<headers.length;i++){
    const current=headers[i];
    if(typeof current.number!=="bigint" || !/^0x[a-fA-F0-9]{64}$/.test(current.hash) ||
       !/^0x[a-fA-F0-9]{64}$/.test(current.parentHash))
      throw new Error("Malformed indexed block header.");
    if(i>0 && (current.number!==headers[i-1].number+1n ||
      current.parentHash.toLowerCase()!==headers[i-1].hash.toLowerCase()))
      throw new Error("RPC returned discontinuous or reorganized block headers.");
    if(i===0 && priorHash && current.parentHash.toLowerCase()!==priorHash.toLowerCase())
      throw new Error("Block segment does not extend the selected canonical ancestor.");
  }
  return true;
}
