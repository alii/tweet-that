import {Prisma, PrismaClient, User} from "@prisma/client";

export const prisma = new PrismaClient();

export async function findOneByDiscordId(
  discord_id: string
): Promise<Prisma.Prisma__UserClient<User | null>> {
  return await prisma.user.findFirst({
    where: {discord_id},
  });
}

export async function findOneByUidAndDiscordId(discord_id: string, uid: string) {}
