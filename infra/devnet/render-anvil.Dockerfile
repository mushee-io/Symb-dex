# Render private service: disposable-value persistent EVM, not VERY mainnet.
# Review/pin this image tag prior to unrestricted public beta.
FROM ghcr.io/foundry-rs/foundry:latest
EXPOSE 8545
ENTRYPOINT ["anvil"]
CMD ["--host", "0.0.0.0", "--port", "8545", "--chain-id", "31338", "--state", "/data/state.json", "--state-interval", "10", "--accounts", "2", "--balance", "10000", "--block-time", "2"]
