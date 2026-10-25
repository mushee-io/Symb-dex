FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts --no-audit --no-fund
COPY services/indexer/ services/indexer/
COPY scripts/index-testnet.mjs scripts/index-testnet.mjs
COPY scripts/daemon-testnet-indexer.mjs scripts/daemon-testnet-indexer.mjs
COPY lib/testnet/ lib/testnet/
COPY config/networks.testnet.json config/deployments.testnet.json config/
CMD ["node","scripts/daemon-testnet-indexer.mjs"]
