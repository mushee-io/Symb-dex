/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    // wagmi's shared connector barrel includes the unused Base Account connector.
    // Exclude its server-side payment SDK to avoid bundling unrelated optional x402
    // dependencies. Lidde enables only injected() and opt-in walletConnect().
    config.resolve.alias = {
      ...config.resolve.alias,
      "@base-org/account": false,
      "@coinbase/cdp-sdk": false,
    };
    return config;
  },
};

export default nextConfig;
