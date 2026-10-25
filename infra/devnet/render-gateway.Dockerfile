# Render public service. No Docker Anvil admin methods are exposed.
FROM node:22-alpine
WORKDIR /app
COPY infra/devnet/rpc-gateway.mjs /app/gateway.mjs
ENV NODE_ENV=production
EXPOSE 3000
# Render wires host:port of its private Anvil service through UPSTREAM_RPC_HOSTPORT.
# Fail closed if the private service address is missing.
CMD ["sh", "-ec", "test -n \"$UPSTREAM_RPC_HOSTPORT\"; export UPSTREAM_RPC_URL=\"http://$UPSTREAM_RPC_HOSTPORT\"; exec node /app/gateway.mjs"]
