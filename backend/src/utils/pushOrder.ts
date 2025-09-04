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

export async function creteBalance(email: string, userId: string) {
  try {
    await client.xadd("create-balance", JSON.stringify({ email, userId }));
    console.log("balance creation request goen for emial : ", email);
  } catch (e) {
    console.log(e);
  }
}
