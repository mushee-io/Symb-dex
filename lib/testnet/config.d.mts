export const DEMO_TOKEN_SYMBOLS:readonly string[];
export function validateTestnet(options:{network:unknown;deployments:unknown}):{
  ready:boolean;errors:string[];chainId:number|null;
};
