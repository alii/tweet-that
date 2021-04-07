import {Command} from "../../types/command";
import {findTwitterUser, generateTweetClient, twitter} from "../../services/twitter";
import {findOneByDiscordId} from "../../services/prisma";
import {TwitterClient} from "twitter-api-client";

export const tweet: Command = {
  aliases: ["tweet"],
  description: "Reply to a message with this command to Tweet it from your account",
  inhibitors: [],
  async run(message) {
    const messageId = message.reference?.messageID;

    if (!messageId) {
      return;
    }

    const foundMessage = await message.channel.messages.fetch(messageId);
    const attachment = foundMessage.attachments.first();
    const client = await generateTweetClient(message.author.id);

    const foundUser = await findOneByDiscordId(foundMessage.author.id);

    const twitterUser = foundUser ? (await findTwitterUser(foundUser?.uid))[0] : null;

    const status = twitterUser
      ? `@${twitterUser["screen_name"] + " " + foundMessage.content}`
      : foundMessage.content;

    const tweet = await client.tweets.statusesUpdate({
      status: attachment ? `${status} ${attachment.url}` : status,
    });

    await twitter.tweets.statusesRetweetById({id: tweet.id_str});
    await twitter.tweets.favoritesCreate({id: tweet.id_str});

    await foundMessage.react("<:twitter:829103050132029461>");
    await message.reply(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
  },
};
