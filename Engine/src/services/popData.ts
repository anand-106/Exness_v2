import { createClient } from "redis";
import { OpenOrder, OrderQueue } from "../types/types";
import { PRICES } from "../getLatestPrices";

const client = createClient();

client.connect();

const OpenOrders: Record<string, OpenOrder> = {};

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

    const orderData: OrderQueue = JSON.parse(messages[0].message.message);

    if (orderData.mode == "create-order") {
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
      };
      console.log("received order ", OpenOrders[orderData.orderId]);

      client.xAdd("callback-queue", "*", {
        id: orderData.orderId,
      });

      console.log("order id sent back");
      
    }
  }
});
