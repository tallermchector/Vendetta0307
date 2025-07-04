-- CreateTable
CREATE TABLE "User" (
    "id_usuario" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "idioma" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_familia" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Family" (
    "id_familia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "emblema_url" TEXT,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id_familia")
);

-- CreateTable
CREATE TABLE "PlayerProfile" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "puntos_edificios" INTEGER NOT NULL,
    "puntos_tropas" INTEGER NOT NULL,
    "puntos_entrenamiento" INTEGER NOT NULL,
    "ranking_global" INTEGER NOT NULL,
    "lealtad" INTEGER NOT NULL,

    CONSTRAINT "PlayerProfile_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "PlayerResources" (
    "id_recursos" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "armas" BIGINT NOT NULL,
    "municion" BIGINT NOT NULL,
    "alcohol" BIGINT NOT NULL,
    "dolares" BIGINT NOT NULL,
    "ultima_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerResources_pkey" PRIMARY KEY ("id_recursos")
);

-- CreateTable
CREATE TABLE "Propiedad" (
    "id_propiedad" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "coord_x" INTEGER NOT NULL,
    "coord_y" INTEGER NOT NULL,
    "coord_z" INTEGER NOT NULL,
    "oficina" INTEGER NOT NULL DEFAULT 0,
    "escuela" INTEGER NOT NULL DEFAULT 0,
    "armeria" INTEGER NOT NULL DEFAULT 0,
    "municion" INTEGER NOT NULL DEFAULT 0,
    "cerveceria" INTEGER NOT NULL DEFAULT 0,
    "taberna" INTEGER NOT NULL DEFAULT 0,
    "contrabando" INTEGER NOT NULL DEFAULT 0,
    "almacenArm" INTEGER NOT NULL DEFAULT 0,
    "deposito" INTEGER NOT NULL DEFAULT 0,
    "almacenAlc" INTEGER NOT NULL DEFAULT 0,
    "caja" INTEGER NOT NULL DEFAULT 0,
    "campo" INTEGER NOT NULL DEFAULT 0,
    "seguridad" INTEGER NOT NULL DEFAULT 0,
    "torreta" INTEGER NOT NULL DEFAULT 0,
    "minas" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Propiedad_pkey" PRIMARY KEY ("id_propiedad")
);

-- CreateTable
CREATE TABLE "Building" (
    "id_edificio" INTEGER NOT NULL,
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

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id_edificio")
);

-- CreateTable
CREATE TABLE "PlayerTraining" (
    "id_player_training" SERIAL NOT NULL,
    "id_perfil" INTEGER NOT NULL,
    "id_training" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "PlayerTraining_pkey" PRIMARY KEY ("id_player_training")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "User_usuario_key" ON "User"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Family_nombre_key" ON "Family"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Family_tag_key" ON "Family"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProfile_id_usuario_key" ON "PlayerProfile"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerResources_id_usuario_key" ON "PlayerResources"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Propiedad_coord_x_coord_y_coord_z_key" ON "Propiedad"("coord_x", "coord_y", "coord_z");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTraining_id_perfil_id_training_key" ON "PlayerTraining"("id_perfil", "id_training");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "Family"("id_familia") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerProfile" ADD CONSTRAINT "PlayerProfile_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerResources" ADD CONSTRAINT "PlayerResources_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propiedad" ADD CONSTRAINT "Propiedad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "User"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTraining" ADD CONSTRAINT "PlayerTraining_id_perfil_fkey" FOREIGN KEY ("id_perfil") REFERENCES "PlayerProfile"("id_perfil") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTraining" ADD CONSTRAINT "PlayerTraining_id_training_fkey" FOREIGN KEY ("id_training") REFERENCES "Training"("id_training") ON DELETE CASCADE ON UPDATE CASCADE;
