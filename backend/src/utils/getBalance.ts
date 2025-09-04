import Redis from "ioredis";

const client = new Redis()

export async function getBalance(userId:string){

  let lastId = '$'

    console.log("user balance request recieved for ",userId)
    await client.xadd('balance-request','*','userId',userId)

    while(true){
       const stream =  await client.xread('BLOCK',0,"STREAMS",'balance-response',lastId)

       const [streamName, message] = stream![0] as any;
    for (const [id, data] of message) {
      lastId = id
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
