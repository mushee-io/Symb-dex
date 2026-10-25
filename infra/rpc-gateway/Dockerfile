FROM node:22-alpine
WORKDIR /gateway
COPY infra/rpc-gateway/policy.mjs infra/rpc-gateway/server.mjs ./
USER node
EXPOSE 8080
CMD ["node","server.mjs"]
