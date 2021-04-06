import fastify from "fastify";
import {redis} from "./services/redis";
import {callbackSchema} from "./services/schemas";
import {twitter} from "./services/twitter";
import {prisma} from "./services/prisma";

const app = fastify();

app.get("/callback", async (req, res) => {
  const {oauth_token, oauth_verifier} = callbackSchema.parse(req.query);

  const redisToken = await redis.get(`oauth:${oauth_token}`);
  if (!redisToken) {
    throw new Error("Cannot find redis token");
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Lib typings are wrong!
  const twitterAuth = await twitter.basics.oauthAccessToken({oauth_verifier, oauth_token});
  const discord_id = redisToken.substr(redisToken.lastIndexOf(":") + 1);

  const existingUser = await prisma.user.findFirst({
    where: {AND: [{discord_id}, {uid: twitterAuth.user_id}]},
  });

  if (existingUser) {
    res.send("Already exisiting user");
    return;
  }

  await prisma.user.create({
    data: {
      discord_id,
      uid: twitterAuth.user_id,
      oauth_token: twitterAuth.oauth_token,
      oauth_token_secret: twitterAuth.oauth_token_secret,
    },
  });

  res.send("Have a nice day, Twitter");
});

export async function start(): Promise<void> {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
  }
}
