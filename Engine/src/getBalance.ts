// import { client } from "./getOrderQueue";
import Redis from "ioredis";
import { AssetBalance, BalanceAssets } from "./types/types";


export const USER_BALANCES :Record<string,Record<BalanceAssets,AssetBalance>> = {}

const client = new Redis()

export async function getBalance(){
    while(true){
        const stream = await client.xread("BLOCK",0,"STREAMS","create-balance","$")

        if (!stream) continue;

       

    const [streamName, message] = stream[0] as any;
    for (const [id, data] of message) {
      const [name, userId] = data;
      if(!USER_BALANCES[userId]){
        console.log("Creating balance for user:", userId);
        USER_BALANCES[userId] = {
            'USD':{
                balance:500000,
                decimals:2
            },
            'BTC':{
                balance:0,
                decimals:4
            },
            'ETH':{
                balance:0,
                decimals:6
            },
            "SOL":{
                balance:0,
                decimals:6
            }
        }
        console.log("user balance created ",USER_BALANCES)
      }
    }
}
}

export async function sendBalance(){

    const balanceClient = new Redis()
    try{
        let userBalance;
        let userId;
        console.log("listening for balace request")
        while(true){
            const stream =  await client.xread('BLOCK',0,"STREAMS",'user-balance','$')
            
            const [streamName, message] = stream![0] as any;
            for (const [id, data] of message) {
                const [name, rawUserId] = data;
                if(name=='userId')
                    {
                        userId = rawUserId
                        console.log("balance request received for user ",userId)
                        userBalance = USER_BALANCES[userId]
                        await balanceClient.xadd('user-balance','*','balance',JSON.stringify(userBalance))
                        console.log("user balance sent of user ",userId,userBalance)
            }
           }
         }


        
    }catch(e){
        console.log(e)
    }
    
}