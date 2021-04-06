/*
  Warnings:

  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.
  - Added the required column `uid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oauth_token` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oauth_token_secret` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "score",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD COLUMN     "oauth_token" TEXT NOT NULL,
ADD COLUMN     "oauth_token_secret" TEXT NOT NULL;
