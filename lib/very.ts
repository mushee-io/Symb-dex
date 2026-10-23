import { defineChain } from "viem";
import config from "@/config/very-mainnet.json";

export const VERY_NETWORK = config;

export const very = defineChain({
  id: config.chainId,
  name: config.name,
  nativeCurrency: config.currency,
  rpcUrls: {
    default: { http: [config.rpcUrl] },
    public: { http: [config.rpcUrl] },
  },
  blockExplorers: {
    default: { name: "VeryScan", url: config.blockExplorer },
  },
});

export const walletChainParameters = {
  chainId: config.chainIdHex,
  chainName: config.name,
  nativeCurrency: config.currency,
  rpcUrls: [config.rpcUrl],
  blockExplorerUrls: [config.blockExplorer],
};
