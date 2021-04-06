import {TwitterClient, UsersLookup} from "twitter-api-client";
import {apiKey, apiSecret, accessTokenSecret, accessToken} from "../constants";
import {redis} from "./redis";
import {prisma} from "./prisma";

export const twitter = new TwitterClient({
  apiKey,
  apiSecret,
  accessToken,
  accessTokenSecret,
});

export async function generateAuthUrl(id: string): Promise<string> {
  const token = await twitter.basics.oauthRequestToken();
  await redis.set(`oauth:${token.oauth_token}`, `${token.oauth_token_secret}:${id}`, "ex", 120);

  return `https://api.twitter.com/oauth/authorize?oauth_token=${token.oauth_token}`;
}

export async function findTwitterUser(user_id: string | undefined): Promise<UsersLookup[]> {
  return await twitterClient.accountsAndUsers.usersLookup({
    user_id,
  });
}

export async function generateTweetClient(id: string): Promise<TwitterClient> {
  const user = await prisma.user.findFirst({where: {discord_id: id}});

  if (!user) {
    throw new Error("Cannot find that user");
  }

  return new TwitterClient({
    apiKey,
    apiSecret,
    accessToken: user.oauth_token,
    accessTokenSecret: user.oauth_token_secret,
  });
}
