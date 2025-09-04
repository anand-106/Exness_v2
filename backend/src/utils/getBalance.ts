import Redis from "ioredis";

const client = new Redis()

export async function getBalance(userId:string){
    console.log("user balance request recieved for ",userId)
    await client.xadd('user-balance','*','userId',userId)

    while(true){
       const stream =  await client.xread('BLOCK',0,"STREAMS",'user-balance','$')

       const [streamName, message] = stream![0] as any;
    for (const [id, data] of message) {
      const [name, RawUserBalance] = data;
      if(name=='balance')
      {
          const userBalance = JSON.parse(RawUserBalance)
          console.log("recieved balance",userBalance)
        return userBalance
      }
      }
    }
    }
