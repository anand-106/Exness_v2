import { Router, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OrderQueue } from "../types/types";
import { pushOrder } from "../services/pushData";
import { RedisSubscriber } from "../services/redisSubscriber";

const router = Router();

type TradeCreateReq = {
  asset: "BTC" | "ETH" | "SOL";
  type: "long" | "short";
  margin: number;
  leverage: number;
  slippage: number;
};

const redisSubscriber = new RedisSubscriber()

router.post(
  "/create",
  async (req: Request<{}, {}, TradeCreateReq, {}>, res) => {
    const TradeOptions = req.body;
    const id = (req as any).id;

    const orderId = uuidv4();

    const OrderQueueItem: OrderQueue = {
      mode:"create-order",
      asset: TradeOptions.asset,
      orderId: orderId,
      userId: id,
      type: TradeOptions.type,
      margin: TradeOptions.margin,
      leverage: TradeOptions.leverage,
      slippage: TradeOptions.slippage,
    };

    
    await pushOrder(OrderQueueItem)

    const orderIdRes = await redisSubscriber.waitForMeassage(orderId)

    res.json({orderId:orderIdRes})
    
  }
);

export default router;
