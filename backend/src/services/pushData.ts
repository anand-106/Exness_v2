import { json } from "express";
import { createClient } from "redis";
import { OrderQueue } from "../types/types";


const client = createClient()
client.connect();

export const CREATE_ORDER_QUEUE = "trade-stream"

export async function pushOrder(data:OrderQueue){

    try{

        
        console.log("sending message to the queue")
        
        await client.xAdd(CREATE_ORDER_QUEUE,"*",{
            message:JSON.stringify(data)
        })
        
        console.log("pushed data to queue")
    }catch(e){
        console.log(e)
    }
}