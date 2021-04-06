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
  const something = await twitterClient.basics.oauthAccessToken({oauth_verifier, oauth_token});
  res.send("pog");
});

export const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
  }
};
