import { Redis } from "ioredis";
import "./getOrderQueue";
import { getLatestPrices } from "./getLatestPrices";

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
}
main()