import { Redis } from "ioredis";
import { Worker } from "bullmq";
import { PRICES } from "./server";
import { OpenOrder } from "./types/types";

const OpenOrders: Record<string, OpenOrder> = {};

const connection = new Redis({
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "order-queue",
  async (job) => {
    if (job.name == "create") {
      const { leverage, slippage, type, asset, email, orderId, margin } =
        job.data;

      const CurrentPrice = PRICES[asset]!.price;

      const qty = (margin * leverage) / CurrentPrice;

      OpenOrders[orderId] = {
        openPrice: CurrentPrice,
        type,
        leverage,
        asset,
        email,
        slippage,
        qty,
        margin,
      };

      console.log(OpenOrders[orderId]);
    }
  },
  { connection }
);

worker.on("completed", () => {
  console.log("order completed");
});

// worker.on('error')
