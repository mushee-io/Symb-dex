export const factoryAbi = [
  { type: "function", name: "getPair", stateMutability: "view",
    inputs: [{ name: "tokenA", type: "address" }, { name: "tokenB", type: "address" }],
    outputs: [{ name: "pair", type: "address" }] },
];

export const pairAbi = [
  { type: "function", name: "token0", stateMutability: "view", inputs: [], outputs: [{name:"",type:"address"}] },
  { type: "function", name: "token1", stateMutability: "view", inputs: [], outputs: [{name:"",type:"address"}] },
  { type: "function", name: "getReserves", stateMutability: "view", inputs: [],
    outputs: [{name:"reserve0",type:"uint112"},{name:"reserve1",type:"uint112"},{name:"blockTimestampLast",type:"uint32"}] },
];

export const routerAbi = [
  {type:"function",name:"swapExactTokensForTokens",stateMutability:"nonpayable",
    inputs:[{name:"amountIn",type:"uint256"},{name:"amountOutMin",type:"uint256"},{name:"path",type:"address[]"},{name:"to",type:"address"},{name:"deadline",type:"uint256"}],
    outputs:[{name:"amounts",type:"uint256[]"}]},
  {type:"function",name:"swapExactETHForTokens",stateMutability:"payable",
    inputs:[{name:"amountOutMin",type:"uint256"},{name:"path",type:"address[]"},{name:"to",type:"address"},{name:"deadline",type:"uint256"}],
    outputs:[{name:"amounts",type:"uint256[]"}]},
  {type:"function",name:"swapExactTokensForETH",stateMutability:"nonpayable",
    inputs:[{name:"amountIn",type:"uint256"},{name:"amountOutMin",type:"uint256"},{name:"path",type:"address[]"},{name:"to",type:"address"},{name:"deadline",type:"uint256"}],
    outputs:[{name:"amounts",type:"uint256[]"}]},
];
