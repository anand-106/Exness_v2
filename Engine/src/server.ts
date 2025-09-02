import { Redis } from "ioredis";

type Trade = {
  price: number;
  decimal: number;
};

type PPTrade = {
  asset: string;
  price: number;
  decimal: number;
};

const PRICES: Record<string, Trade> = {};

const redis = new Redis();

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("close", () => {
  console.log("Redis disconnected");
});

redis.on("error", () => {
  console.log("Redis connection Error");
});

redis.subscribe("price_updates", (err, count) => {
  console.log("error subscribing ", err);
});

redis.on("message", (channel, msg) => {
  const data = JSON.parse(msg);

  data["price_updates"].map((trade: PPTrade) => {
    PRICES[trade.asset] = {
      price: trade.price,
      decimal: trade.decimal,
    };
  });

  console.log(PRICES);
});
