-- CreateTable
CREATE TABLE "RefererCode" (
    "id" TEXT NOT NULL,
    "refererId" VARCHAR(50) NOT NULL,
    "refererCode" VARCHAR(50) NOT NULL,

    CONSTRAINT "RefererCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefererCode_refererCode_key" ON "RefererCode"("refererCode");
