-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RoomInvitation" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "invitationStatus" "InvitationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "RoomInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomInvitation_roomId_userId_key" ON "RoomInvitation"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "RoomInvitation" ADD CONSTRAINT "RoomInvitation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomInvitation" ADD CONSTRAINT "RoomInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
