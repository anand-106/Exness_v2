
import { getLatestPrices } from "./getLatestPrices";
// import "./getOrderQueue";
import './services/popData'


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