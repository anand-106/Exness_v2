import { client } from "./pushOrder";





export async function creteBalance(userId: string) {
    try {
      await client.xadd("create-balance", '*','data', userId );
      console.log("balance creation request goen for emial : ", userId);
    } catch (e) {
      console.log(e);
    }
  }