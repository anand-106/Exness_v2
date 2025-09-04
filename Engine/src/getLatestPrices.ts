import { client } from "./getOrderQueue";


type Trade = {
    price: number;
    decimal: number;
  };
  
 export type PPTrade = {
    asset: string;
    price: number;
    decimal: number;
  };

export const PRICES: Record<string, Trade> = {};

export async function getLatestPrices() {

    
    while(true){
        const stream = await client.xread("BLOCK",0,"STREAMS",'latest-prices','$')

        if (!stream) continue;

        const [streamName, message] = stream[0] as any;
        for (const [id, data] of message) {
          const [name, rawPrices] = data;
          const trades: PPTrade[] = JSON.parse(rawPrices).price_updates;
          console.log("trades are ",trades)
          trades.map(trade=>{
            PRICES[trade.asset] = {
                price: trade.price,
                decimal: trade.decimal,
              };
          })
          console.log(PRICES)
        }
    }
}