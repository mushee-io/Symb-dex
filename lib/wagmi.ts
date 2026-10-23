import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { very } from "@/lib/very";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

export const wagmiConfig = createConfig({
  chains: [very],
  // EIP-6963 discovers MetaMask, Rabby and other installed injected wallets.
  multiInjectedProviderDiscovery: true,
  ssr: true,
  connectors: [
    injected({ shimDisconnect: true }),
    ...(walletConnectProjectId
      ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: true })]
      : []),
  ],
  transports: {
    [very.id]: http(very.rpcUrls.default.http[0], { timeout: 12_000, retryCount: 2 }),
  },
});

export const isWalletConnectConfigured = Boolean(walletConnectProjectId);
