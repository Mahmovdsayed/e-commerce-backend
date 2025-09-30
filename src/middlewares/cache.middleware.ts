import { Request, Response, NextFunction } from "express";
import redis from "../helpers/redis.js";

export const cacheMiddleware = (keyPrefix: string, ttl = 60) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `${keyPrefix}:${req.originalUrl}`;
    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        console.log("⚡ Cache hit:", key);
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redis.setex(key, ttl, JSON.stringify(body));
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Redis error:", err);
      next();
    }
  };
};
