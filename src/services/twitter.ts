import {TwitterClient, UsersLookup} from "twitter-api-client";
import {apiKey, apiSecret, accessTokenSecret, accessToken} from "../constants";
import {redis, wrapRedis} from "./redis";
import {findOneByDiscordId, prisma} from "./prisma";

export const twitter = new TwitterClient({
  apiKey,
  apiSecret,
  accessToken,
  accessTokenSecret,
});

export async function generateAuthUrl(id: string): Promise<string> {
  const existing = await findOneByDiscordId(id);

  if (existing) {
    throw new Error("You have already connected your account.");
  }

  const token = await twitter.basics.oauthRequestToken({
    oauth_callback: process.env.OAUTH_CALLBACK || "http://localhost:3000/callback",
  });

  await redis.set(`oauth:${token.oauth_token}`, `${token.oauth_token_secret}:${id}`, "ex", 120);

  return `https://api.twitter.com/oauth/authorize?oauth_token=${token.oauth_token}`;
}

export function findTwitterUser(user_id: string | undefined): Promise<UsersLookup[]> {
  return wrapRedis(`twitter:${user_id}`, () => {
    return twitter.accountsAndUsers.usersLookup({user_id})
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
