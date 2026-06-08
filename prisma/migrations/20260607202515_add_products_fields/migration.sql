-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "hint" TEXT DEFAULT '',
ADD COLUMN     "how_use" TEXT DEFAULT '',
ADD COLUMN     "ingredients" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "ProductVariants" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ProductVariants_pkey" PRIMARY KEY ("id")
);
