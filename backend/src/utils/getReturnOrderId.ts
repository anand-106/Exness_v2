
import Redis from "ioredis";
import { OrderQueue } from "../types/types";

export async function getReturnOrderId(order:OrderQueue) {

  const returnOrderIdClient = new Redis()
    try{
        while (true) {
            const stream = await returnOrderIdClient.xread(
              "BLOCK",
              0,
              "STREAMS",
              "return-orderId",
              "0"
            );
      
            if (!stream) continue;
      
            const [streamName, message] = stream[0] as any;
            for (const [id, data] of message) {
              const [name, orderId] = data;
              if (order.orderId === orderId) {
                console.log("received order id back")
                return orderId;
              } else {
                // return null;
              }
              
            }
          }
    }catch(e){
        console.log("error getting return order id")
    }
}