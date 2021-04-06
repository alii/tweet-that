import fastify from "fastify";
import {redis} from "./services/redis";
import {callbackSchema} from "./services/schemas";
import {twitterClient} from "./services/twitter";
import {prisma} from "./services/prisma";

const app = fastify();

app.get("/callback", async (req, res) => {
  const {oauth_token, oauth_verifier} = callbackSchema.parse(req.query);

  const redisToken = await redis.get(`oauth:${oauth_token}`);
  if (!redisToken) {
    throw new Error("Cannot find redis token");
  }
  //@ts-ignore
  const twitterAuth = await twitterClient.basics.oauthAccessToken({oauth_verifier, oauth_token});
  const discord_id = redisToken.substr(redisToken.lastIndexOf(":"));
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

export const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
  }
};
