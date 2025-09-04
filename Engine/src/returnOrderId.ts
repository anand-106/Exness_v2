import { client } from "./getOrderQueue";


export async function returnOrderId(orderData:any){
    await client.xadd("create-order", "*", "orderId", orderData.orderId);
}