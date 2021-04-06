import {TwitterClient} from "twitter-api-client";
import {apiKey, apiSecret, accessTokenSecret, accessToken} from "../constants";
import {redis} from "./redis";

export const twitterClient = new TwitterClient({
  apiKey,
  apiSecret,
  accessToken,
  accessTokenSecret,
});

export async function generateAuthUrl() {
  const token = await twitterClient.basics.oauthRequestToken();
  const url = "https://api.twitter.com/oauth/authorize?oauth_token=" + token.oauth_token;
  await redis.set(`oauth:${token.oauth_token}`, token.oauth_token_secret, "ex", 120);
  return url;
}
