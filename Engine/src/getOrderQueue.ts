import { Redis } from "ioredis";
import { PRICES } from "./getLatestPrices";
import { OpenOrder, OrderQueue } from "./types/types";
import { v4 as uuidv4 } from "uuid";
import { returnOrderId } from "./returnOrderId";
import { USER_BALANCES } from "./getBalance";

const OpenOrders: Record<string, OpenOrder> = {};

export const client = new Redis();

async function main() {
  while (true) {
    const stream = await client.xread(
      "BLOCK",
      0,
      "STREAMS",
      "create-order",
      "$"
    );

    if (!stream) continue;

    const [streamName, message] = stream[0] as any;
    for (const [id, data] of message) {
      const [name, orderRawData] = data;
      const orderData:OrderQueue = JSON.parse(orderRawData);
      // console.log(orderData);

      const price = PRICES[orderData.asset]!.price

      const qty = (orderData.margin*orderData.leverage)/price

      OpenOrders[orderData.orderId] = {
        openPrice: price,
        qty: qty,
        type:orderData.type,
        margin:orderData.margin,
        leverage:orderData.leverage,
        slippage:orderData.slippage,
        asset:orderData.asset,
        userId:orderData.userId,
        status:"open"
      }

      USER_BALANCES[orderData.userId]![orderData.asset].balance=qty

      // console.log(OpenOrders)

      await returnOrderId(orderData)
    }
  }
}

main();

// worker.on('error')
