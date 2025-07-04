/*
  Warnings:

  - You are about to alter the column `vel` on the `Recruitment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `BigInt`.

*/
-- DropForeignKey
ALTER TABLE "PlayerProfile" DROP CONSTRAINT "PlayerProfile_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "PlayerRecruitment" DROP CONSTRAINT "PlayerRecruitment_id_perfil_fkey";

-- DropForeignKey
ALTER TABLE "PlayerRecruitment" DROP CONSTRAINT "PlayerRecruitment_id_recruitment_fkey";

-- DropForeignKey
ALTER TABLE "PlayerResources" DROP CONSTRAINT "PlayerResources_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "PlayerTraining" DROP CONSTRAINT "PlayerTraining_id_perfil_fkey";

-- DropForeignKey
ALTER TABLE "PlayerTraining" DROP CONSTRAINT "PlayerTraining_id_training_fkey";

-- DropForeignKey
ALTER TABLE "Propiedad" DROP CONSTRAINT "Propiedad_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_familia_fkey";

-- AlterTable
ALTER TABLE "PlayerRecruitment" ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PlayerTraining" ALTER COLUMN "level" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Recruitment" ALTER COLUMN "velocidad" SET DATA TYPE BIGINT,
ALTER COLUMN "ata" SET DATA TYPE BIGINT,
ALTER COLUMN "def" SET DATA TYPE BIGINT,
ALTER COLUMN "car" SET DATA TYPE BIGINT,
ALTER COLUMN "vel" SET DATA TYPE BIGINT,
ALTER COLUMN "punt" SET DATA TYPE BIGINT;
