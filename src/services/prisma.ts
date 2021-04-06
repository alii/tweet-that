import {Prisma, PrismaClient, User} from "@prisma/client";
import {wrapRedis} from "./redis";

export const prisma = new PrismaClient();

export async function findOneByDiscordId(
  discord_id: string
): Promise<Prisma.Prisma__UserClient<User | null>> {
  return wrapRedis(`user:${discord_id}`, () => {
    return prisma.user.findFirst({
      where: {discord_id},
    });
  });
}

export async function findOneByUidAndDiscordId(
  discord_id: string,
  uid: string
): Promise<Prisma.Prisma__UserClient<User | null>> {
  return wrapRedis(`user:${discord_id}:${uid}`, () => {
    return prisma.user.findFirst({where: {AND: [{discord_id}, {uid}]}});
  });
}
