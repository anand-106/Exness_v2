import { Redis } from "ioredis";
import { Worker } from "bullmq";
import { PRICES } from "./server";
import { OpenOrder } from "./types/types";

const OpenOrders: Record<string, OpenOrder> = {};

const client = new Redis();

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
    }
  }
}

main();

// worker.on('error')
