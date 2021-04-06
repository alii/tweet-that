import fastify from "fastify";
import {redis} from "./services/redis";
import {callbackSchema} from "./services/schemas";
import {twitter} from "./services/twitter";
import {findOneByUidAndDiscordId, prisma} from "./services/prisma";
import fs from "fs";

const app = fastify();

app.get("/callback", async (req, res) => {
  const query = callbackSchema.safeParse(req.query);

  if (!query.success) {
    return res.type("text/html").send(fs.readFileSync("../public/error.html"));
  }

  const {oauth_token, oauth_verifier} = query.data;

  const redisToken = await redis.get(`oauth:${oauth_token}`);
  if (!redisToken) {
    throw new Error("Cannot find redis token");
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Lib typings are wrong!
  const twitterAuth = await twitter.basics.oauthAccessToken({oauth_verifier, oauth_token});
  const discord_id = redisToken.substr(redisToken.lastIndexOf(":") + 1);

  const existingUser = await findOneByUidAndDiscordId(discord_id, twitterAuth.user_id);

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

  res.send("You may now close the tab");
});

export async function start(): Promise<void> {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
  }
}
