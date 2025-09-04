import { Redis } from "ioredis";
import "./getOrderQueue";
import { getLatestPrices } from "./getLatestPrices";
import { getBalance, sendBalance } from "./getBalance";

type Trade = {
  price: number;
  decimal: number;
};

type PPTrade = {
  asset: string;
  price: number;
  decimal: number;
};


async function main() {
   getLatestPrices().catch(console.error)
   getBalance().catch(console.error)
   sendBalance().catch(console.error)
}
main()