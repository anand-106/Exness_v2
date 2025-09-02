import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { OrderQueue } from "../types/types";

const connection = new Redis();

const queue = new Queue("order-queue", { connection });

export async function pushOrder(order: OrderQueue) {
  try {
    await queue.add("create", order);
    console.log(`order ${order.orderId} queued`);
  } catch (e) {
    console.log(e);
  }
}
