export type OpenOrder = {
  openPrice: number;
  qty: number;
  type: "long" | "short";
  margin: number;
  leverage: number;
  slippage: number;
  asset: "BTC" | "ETH" | "SOL";
  userId: string;
  pnl?:number;
  status: "open" | "closed" | "liquidated"
};

export type AssetBalance = {
  balance: number;
  decimals: number;
};



export type BalanceAssets = "USD" | "ETH" | "BTC" | "SOL" ;

export type OrderQueue = {
  mode:string,
  asset: "BTC" | "ETH" | "SOL";
  orderId: string;
  userId: string;
  type: "long" | "short";
  margin: number;
  leverage: number;
  slippage: number;
};

