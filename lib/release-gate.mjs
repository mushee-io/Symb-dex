// UI readiness check only. Smart-contract security does not depend on this flag.
const validAddress = (value) =>
  typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value) &&
  !/^0x0{40}$/i.test(value);

export function isTradingEnabled(config) {
  return Boolean(
    config &&
    config.chainId === 4613 &&
    config.status === "production" &&
    config.releaseApproved === true &&
    config.auditReviewed === true &&
    validAddress(config.factory) &&
    validAddress(config.router) &&
    validAddress(config.wrappedVery)
  );
}
