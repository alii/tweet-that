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

/**
 * Find a user by Discord ID and UID
 * @param discord_id
 * @param uid
 */
export async function findOneByUidAndDiscordId(
  discord_id: string,
  uid: string
): Promise<User | null> {
  return wrapRedis(`user:${discord_id}:${uid}`, () => {
    return prisma.user.findFirst({where: {AND: [{discord_id}, {uid}]}});
  });
}
