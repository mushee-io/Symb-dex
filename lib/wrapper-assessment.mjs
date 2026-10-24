// A wrapper probe checks on-chain properties, NOT social provenance.
export function assessWrapper({ code, name, symbol, decimals, supply, nativeBalance }) {
  const issues = [];
  if (typeof code !== "string" || code === "0x" || !/^0x[0-9a-fA-F]+$/.test(code))
    issues.push("No deployed bytecode");
  if (typeof name !== "string" || !/very/i.test(name) || name.length > 96)
    issues.push("Unexpected token name");
  if (symbol !== "WVERY") issues.push("Unexpected token symbol");
  if (decimals !== 18) issues.push("Unexpected decimals");
  if (typeof supply !== "bigint" || supply <= 0n) issues.push("No outstanding supply for collateral assessment");
  if (typeof nativeBalance !== "bigint" || nativeBalance < 0n ||
      typeof supply === "bigint" && nativeBalance < supply)
    issues.push("Native reserves do not cover reported supply");
  return {checksPassed:issues.length===0, issues, canonicalVerified:false,
    conclusion:issues.length?"NOT A VALID WRAPPER CANDIDATE":"ON-CHAIN PROPERTIES PLAUSIBLE; CANONICAL STATUS STILL UNVERIFIED"};
}
