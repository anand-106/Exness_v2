import { Redis } from "ioredis";
import { PRICES } from "./getLatestPrices";
import { OpenOrder } from "./types/types";
import { v4 as uuidv4 } from "uuid";
import { returnOrderId } from "./returnOrderId";

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
      const orderData = JSON.parse(orderRawData);
      console.log(orderData);

      await returnOrderId(orderData)
    }
  }
}

main();

// worker.on('error')
