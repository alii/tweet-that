import {PrismaClient} from "@prisma/client";

export const prisma = new PrismaClient();

export async function findOneByDiscordId(discord_id: string) {
  return await prisma.user.findFirst({
    where: {discord_id},
  });
}
