-- Create ENUM types
CREATE TYPE "ComponentCategory" AS ENUM (
  'CASSETTE',
  'CHAINRING', 
  'CHAIN',
  'HUB',
  'DERAILLEUR',
  'TIRE',
  'WHEEL',
  'CRANK',
  'BOTTOM_BRACKET',
  'SHIFTER',
  'BRAKE',
  'FORK',
  'SHOCK',
  'FRAME'
);

CREATE TYPE "FreehubType" AS ENUM (
  'SHIMANO_HG',
  'SRAM_XD',
  'SRAM_XDR',
  'CAMPAGNOLO_N3W',
  'MICRO_SPLINE',
  'DTSWISS_350',
  'DTSWISS_240'
);

CREATE TYPE "AxleType" AS ENUM (
  'QR_FRONT',
  'QR_REAR',
  'THRU_AXLE_12_FRONT',
  'THRU_AXLE_12_REAR',
  'THRU_AXLE_15_FRONT',
  'THRU_AXLE_15_REAR',
  'BOOST_FRONT',
  'BOOST_REAR'
);

CREATE TYPE "CageLength" AS ENUM (
  'SHORT',
  'MEDIUM',
  'LONG'
);

-- Create extension for generating CUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tables
CREATE TABLE "Component" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER,
    "weightGrams" INTEGER,
    "msrp" DOUBLE PRECISION,
    "verifiedWeight" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "category" "ComponentCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Cassette" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "speeds" INTEGER NOT NULL,
    "cogs" INTEGER[],
    "freehubType" "FreehubType" NOT NULL,
    "spacing" DOUBLE PRECISION,
    "material" TEXT,
    "maxTorque" INTEGER,
    "weightGrams" INTEGER,

    CONSTRAINT "Cassette_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Chainring" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "teeth" INTEGER NOT NULL,
    "bcd" DOUBLE PRECISION,
    "offset" DOUBLE PRECISION,
    "material" TEXT,
    "weightGrams" INTEGER,

    CONSTRAINT "Chainring_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Chain" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "speeds" INTEGER NOT NULL,
    "material" TEXT,
    "weightGrams" INTEGER,
    "links" INTEGER,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Hub" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "frontSpacing" DOUBLE PRECISION,
    "rearSpacing" DOUBLE PRECISION,
    "freehubTypes" "FreehubType"[],
    "axleType" "AxleType",
    "bearingType" TEXT,
    "weightGrams" INTEGER,

    CONSTRAINT "Hub_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Derailleur" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "speeds" INTEGER NOT NULL,
    "maxCapacity" INTEGER,
    "cageLength" "CageLength",
    "weightGrams" INTEGER,

    CONSTRAINT "Derailleur_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Tire" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "compound" TEXT,
    "casing" TEXT,
    "weightGrams" INTEGER,
    "tpi" INTEGER,

    CONSTRAINT "Tire_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Wheel" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentId" TEXT NOT NULL,
    "diameter" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION,
    "material" TEXT,
    "weightGrams" INTEGER,
    "spokeCount" INTEGER,

    CONSTRAINT "Wheel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CompatibilityRule" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "componentFromId" TEXT NOT NULL,
    "componentToId" TEXT NOT NULL,
    "compatible" BOOLEAN NOT NULL,
    "warnings" TEXT[],
    "requiredParts" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompatibilityRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isPro" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SavedBuild" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "components" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedBuild_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProBike" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "riderName" TEXT NOT NULL,
    "team" TEXT,
    "year" INTEGER NOT NULL,
    "bikeModel" TEXT NOT NULL,
    "components" JSONB NOT NULL,
    "imageUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProBike_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Shop" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "Component_category_idx" ON "Component"("category");
CREATE INDEX "Component_manufacturer_idx" ON "Component"("manufacturer");
CREATE INDEX "CompatibilityRule_compatible_idx" ON "CompatibilityRule"("compatible");
CREATE INDEX "SavedBuild_userId_idx" ON "SavedBuild"("userId");
CREATE INDEX "ProBike_riderName_idx" ON "ProBike"("riderName");
CREATE INDEX "ProBike_year_idx" ON "ProBike"("year");

-- Create unique constraints
CREATE UNIQUE INDEX "Component_manufacturer_model_year_key" ON "Component"("manufacturer", "model", "year");
CREATE UNIQUE INDEX "Cassette_componentId_key" ON "Cassette"("componentId");
CREATE UNIQUE INDEX "Chainring_componentId_key" ON "Chainring"("componentId");
CREATE UNIQUE INDEX "Chain_componentId_key" ON "Chain"("componentId");
CREATE UNIQUE INDEX "Hub_componentId_key" ON "Hub"("componentId");
CREATE UNIQUE INDEX "Derailleur_componentId_key" ON "Derailleur"("componentId");
CREATE UNIQUE INDEX "Tire_componentId_key" ON "Tire"("componentId");
CREATE UNIQUE INDEX "Wheel_componentId_key" ON "Wheel"("componentId");
CREATE UNIQUE INDEX "CompatibilityRule_componentFromId_componentToId_key" ON "CompatibilityRule"("componentFromId", "componentToId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Shop_email_key" ON "Shop"("email");

-- Add foreign key constraints
ALTER TABLE "Cassette" ADD CONSTRAINT "Cassette_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chainring" ADD CONSTRAINT "Chainring_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chain" ADD CONSTRAINT "Chain_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Hub" ADD CONSTRAINT "Hub_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Derailleur" ADD CONSTRAINT "Derailleur_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tire" ADD CONSTRAINT "Tire_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Wheel" ADD CONSTRAINT "Wheel_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompatibilityRule" ADD CONSTRAINT "CompatibilityRule_componentFromId_fkey" FOREIGN KEY ("componentFromId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CompatibilityRule" ADD CONSTRAINT "CompatibilityRule_componentToId_fkey" FOREIGN KEY ("componentToId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavedBuild" ADD CONSTRAINT "SavedBuild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; 