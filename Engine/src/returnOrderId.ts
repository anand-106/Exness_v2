import Redis from "ioredis";

const returnClient = new Redis()

export async function returnOrderId(orderData:any){

    await returnClient.xadd("return-orderId", "*", "orderId", orderData.orderId);
    console.log("returned order id")
}