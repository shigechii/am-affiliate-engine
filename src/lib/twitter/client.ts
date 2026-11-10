import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.X_API_KEY || "",
  appSecret: process.env.X_API_SECRET || "",
  accessToken: process.env.X_ACCESS_TOKEN || "",
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET || "",
});

// App-only client if needed for read-only tasks
export const twitterClient = client.readWrite;
