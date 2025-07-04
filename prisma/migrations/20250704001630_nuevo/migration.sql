-- DropForeignKey
ALTER TABLE "PlayerProfile" DROP CONSTRAINT "PlayerProfile_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "PlayerResources" DROP CONSTRAINT "PlayerResources_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Propiedad" DROP CONSTRAINT "Propiedad_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_familia_fkey";

-- AlterTable
ALTER TABLE "PlayerProfile" ADD COLUMN     "ent_ametralladora" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ent_combate" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ent_pistola" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Training" (
    "id_training" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "costo_base" JSONB NOT NULL,
    "c_armas" INTEGER NOT NULL,
    "c_municion" INTEGER NOT NULL,
    "c_alcohol" INTEGER NOT NULL,
    "c_dolares" INTEGER NOT NULL,
    "fac_costo" DOUBLE PRECISION NOT NULL,
    "t_horas" TEXT NOT NULL,
    "t_minutos" TEXT NOT NULL,
    "t_segundos" TEXT NOT NULL,
    "fac_dura" DOUBLE PRECISION NOT NULL,
    "imagen_url" TEXT NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id_training")
);
