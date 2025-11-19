import { Queue } from "bullmq";
import { connection } from "./redisClient.js";

export const taskQueue = new Queue("task-verification-queue", {
  connection,
});
