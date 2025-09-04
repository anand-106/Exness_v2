import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { OrderQueue } from "../types/types";
import { getReturnOrderId } from "./getReturnOrderId";

export const client = new Redis();

export async function pushOrder(order: OrderQueue) {
  try {
    await client.xadd("create-order", "*", "data", JSON.stringify(order));
    console.log(`order  queued`);
    const orderId = await getReturnOrderId(order)
    return orderId
  } catch (e) {
    console.log(e);
  }
}


