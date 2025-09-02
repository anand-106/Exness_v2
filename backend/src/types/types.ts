export type OrderQueue = {
  asset: "BTC" | "ETH" | "SOL";
  orderId: string;
  email: string;
  type: "long" | "short";
  margin: number;
  leverage: number;
  slippage: number;
};
