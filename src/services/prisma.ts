import {PrismaClient, User} from "@prisma/client";
import {wrapRedis} from "./redis";

export const prisma = new PrismaClient();

/**
 * Find a user by Discord ID
 * @param discord_id
 */
export function findOneByDiscordId(discord_id: string): Promise<User | null> {
  return wrapRedis(`user:${discord_id}`, () => {
    return prisma.user.findFirst({
      where: {discord_id},
    });
  });
}
