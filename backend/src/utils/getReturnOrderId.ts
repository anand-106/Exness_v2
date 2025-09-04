import { client } from "./pushOrder";
import { OrderQueue } from "../types/types";

export async function getReturnOrderId(order:OrderQueue) {
    try{
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
              const [name, orderId] = data;
              if (order.orderId === orderId) {
                return orderId;
              } else {
                return null;
              }
              
            }
          }
    }catch(e){
        console.log("error getting return order id")
    }
}