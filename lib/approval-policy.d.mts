import type { Address } from "viem";
export interface DeploymentGate {
  chainId: number;
  status: string;
  releaseApproved: boolean;
  auditReviewed: boolean;
  factory: string | null;
  router: string | null;
  wrappedVery: string | null;
}
export function allowedRouter(deployment: DeploymentGate): Address | null;
export function canApprove(args: {
  deployment: DeploymentGate;
  connectedAddress?: string;
  connectedChainId: number;
  tokenAddress?: string;
}): boolean;
