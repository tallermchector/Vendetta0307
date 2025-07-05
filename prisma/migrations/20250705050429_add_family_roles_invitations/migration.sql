-- CreateEnum
CREATE TYPE "RoleInFamily" AS ENUM ('Leader', 'CoLeader', 'Member');

-- DropForeignKey
ALTER TABLE "PlayerRecruitment" DROP CONSTRAINT "PlayerRecruitment_id_recruitment_fkey";

-- DropForeignKey
ALTER TABLE "PlayerSecurity" DROP CONSTRAINT "PlayerSecurity_id_security_fkey";

-- DropForeignKey
ALTER TABLE "PlayerTraining" DROP CONSTRAINT "PlayerTraining_id_training_fkey";

-- AlterTable
ALTER TABLE "PlayerProfile" ALTER COLUMN "puntos_edificios" SET DATA TYPE BIGINT,
ALTER COLUMN "puntos_tropas" SET DATA TYPE BIGINT,
ALTER COLUMN "puntos_entrenamiento" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleInFamily" "RoleInFamily";

-- CreateTable
CREATE TABLE "FamilyInvitation" (
    "id_invitation" SERIAL NOT NULL,
    "id_familia" INTEGER NOT NULL,
    "id_usuario_invitado" INTEGER NOT NULL,
    "fecha_invitacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyInvitation_pkey" PRIMARY KEY ("id_invitation")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyInvitation_id_familia_id_usuario_invitado_key" ON "FamilyInvitation"("id_familia", "id_usuario_invitado");

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "Family"("id_familia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_id_usuario_invitado_fkey" FOREIGN KEY ("id_usuario_invitado") REFERENCES "User"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTraining" ADD CONSTRAINT "PlayerTraining_id_training_fkey" FOREIGN KEY ("id_training") REFERENCES "Training"("id_training") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerRecruitment" ADD CONSTRAINT "PlayerRecruitment_id_recruitment_fkey" FOREIGN KEY ("id_recruitment") REFERENCES "Recruitment"("id_recruitment") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerSecurity" ADD CONSTRAINT "PlayerSecurity_id_security_fkey" FOREIGN KEY ("id_security") REFERENCES "Security"("id_security") ON DELETE CASCADE ON UPDATE CASCADE;
