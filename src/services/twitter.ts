import {TwitterClient, UsersLookup} from "twitter-api-client";
import {apiKey, apiSecret, accessTokenSecret, accessToken} from "../constants";
import {redis} from "./redis";
import {prisma} from "./prisma";

export const twitterClient = new TwitterClient({
  apiKey,
  apiSecret,
  accessToken,
  accessTokenSecret,
});

export async function generateAuthUrl(id: string): Promise<string> {
  const token = await twitterClient.basics.oauthRequestToken();
  const url = "https://api.twitter.com/oauth/authorize?oauth_token=" + token.oauth_token;
  await redis.set(`oauth:${token.oauth_token}`, `${token.oauth_token_secret}:${id}`, "ex", 120);
  return url;
}

export async function findTwitterUser(user_id: string | undefined): Promise<UsersLookup[]> {
  return await twitterClient.accountsAndUsers.usersLookup({
    user_id,
  });
}

export const generateTweetClient = async (id: string): Promise<TwitterClient> => {
  console.log(id);
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
};
