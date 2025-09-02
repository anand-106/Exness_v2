import { Router, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import { OrderQueue } from "../types/types";
import { pushOrder } from "../utils/pushOrder";

const router = Router();

type TradeCreateReq = {
  asset: "BTC" | "ETH" | "SOL";
  type: "long" | "short";
  margin: number;
  leverage: number;
  slippage: number;
};

router.post(
  "/create",
  async (req: Request<{}, {}, TradeCreateReq, {}>, res) => {
    const TradeOptions = req.body;
    const email = (req as any).email;

    const orderId = uuidv4();

    const OrderQueueItem: OrderQueue = {
      asset: TradeOptions.asset,
      orderId: orderId,
      email: email,
      type: TradeOptions.type,
      margin: TradeOptions.margin,
      leverage: TradeOptions.leverage,
      slippage: TradeOptions.slippage,
    };

    await pushOrder(OrderQueueItem);

    res.json({ orderId });
  }
);

export default router;
