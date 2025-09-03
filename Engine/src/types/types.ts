export type OpenOrder = {
  openPrice: number;
  qty: number;
  type: "long" | "short";
  margin: number;
  leverage: number;
  slippage: number;
  asset: "BTC" | "ETH" | "SOL";
  email: string;
};

export type AssetBalance = {
  balance: number;
  decimals: number;
};

export type BalanceAssets = "USD" | "ETH" | "BTC" | "SOL";
