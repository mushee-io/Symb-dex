import { isAddress, getAddress } from "viem";
import { isTradingEnabled } from "./release-gate.mjs";

export function allowedRouter(deployment) {
  if (!isTradingEnabled(deployment) || !isAddress(deployment.router)) return null;
  return getAddress(deployment.router);
}

export function canApprove({ deployment, connectedAddress, connectedChainId, tokenAddress }) {
  return Boolean(
    allowedRouter(deployment) &&
    isAddress(connectedAddress || "") &&
    isAddress(tokenAddress || "") &&
    connectedChainId === 4613
  );
}
