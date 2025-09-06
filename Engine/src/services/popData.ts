import { createClient } from "redis";
import { AssetBalance, BalanceAssets, OpenOrder, OrderQueue } from "../types/types";
import { PRICES } from "../getLatestPrices";

const client = createClient();

client.connect();

export const OpenOrders: Record<string, OpenOrder> = {};
export const USER_BALANCES :Record<string,Record<BalanceAssets,AssetBalance>> = {}

client.on("connect", async () => {
  while (1) {
    const response = await client.xRead(
      {
        key: "trade-stream",
        id: "$",
      },
      {
        BLOCK: 0,
      }
    );

    if (!response || !Array.isArray(response)) continue;

    const streamData = response[0] as { name: string; messages: any[] };
    const { name: streamName, messages } = streamData;

    const Data: any = JSON.parse(messages[0].message.message);

    if (Data.mode == "create-order") {
      const orderData = Data as OrderQueue
      const price = PRICES[orderData.asset]!.price;

      const qty = (orderData.margin * orderData.leverage) / price;

      OpenOrders[orderData.orderId] = {
        openPrice: price,
        qty: qty,
        type: orderData.type,
        margin: orderData.margin,
        leverage: orderData.leverage,
        slippage: orderData.slippage,
        asset: orderData.asset,
        userId: orderData.userId,
        status: "open",
        pnl:0
      };
      console.log("received order ", OpenOrders[orderData.orderId]);

      USER_BALANCES[orderData.userId]![orderData.asset].balance=qty

      client.xAdd("callback-queue", "*", {
        id: orderData.orderId,
        data: orderData.orderId
      });

      console.log("order id sent back");
      
    }
    else if(Data.mode == "balance"){
      const {id,userId} = Data;


      console.log("received balance request of id :",userId)

      if(!USER_BALANCES[userId]){
        console.log("Creating balance for user:", userId);
        USER_BALANCES[userId] = {
            'USD':{
                balance:500000,
                decimals:2
            },
            'BTC':{
                balance:0,
                decimals:4
            },
            'ETH':{
                balance:0,
                decimals:6
            },
            "SOL":{
                balance:0,
                decimals:6
            }
        }
        console.log("user balance created ",USER_BALANCES)

      }

      client.xAdd("callback-queue", "*", {
        id: id,
        data: JSON.stringify(USER_BALANCES[userId])
      });

    }
    else if(Data.mode=="close"){
      const {id,OrderId} = Data
      console.log("received order close request for order ",OrderId)

      const order = OpenOrders[OrderId]

      if(!order) return

      const pnl = order.pnl

      console.log("the pnl is ",pnl)

      order.status = "closed"

      USER_BALANCES[order.userId]!.USD.balance += pnl

      const balance = USER_BALANCES[order.userId]!.USD.balance 

      console.log(order)

      client.xAdd("callback-queue", "*", {
        id: id,
        data: JSON.stringify({balance})
      });
    }
  }
});
