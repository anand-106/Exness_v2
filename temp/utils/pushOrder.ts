import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { OrderQueue } from "../../backend/src/types/types";
import { getReturnOrderId } from "./getReturnOrderId";

export const client = new Redis();

export async function pushOrder(id:string,data: any) {
  try {
    await client.xadd("create-order", "*", "id",id,"type","order","data", JSON.stringify(data));
    console.log(`order  queued`);
    const resId = await getReturnOrderId(data)
    return resId
  } catch (e) {
    console.log(e);
  }
}


