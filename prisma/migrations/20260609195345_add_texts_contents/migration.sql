-- CreateTable
CREATE TABLE "home_contents" (
    "id" TEXT NOT NULL,
    "heroBadge" TEXT,
    "heroTitle" TEXT,
    "heroDescription" TEXT,
    "categoriesTitle" TEXT,
    "categoriesDescription" TEXT,
    "aboutTitle" TEXT,
    "aboutDescription" TEXT,
    "petHotelChip" TEXT,
    "petHotelTitle" TEXT,
    "petHotelDescription" TEXT,
    "contactTitle" TEXT,
    "contactDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_contents_pkey" PRIMARY KEY ("id")
);
