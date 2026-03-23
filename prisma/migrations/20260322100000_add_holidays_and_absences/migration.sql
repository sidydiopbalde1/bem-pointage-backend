-- CreateTable public_holidays
CREATE TABLE IF NOT EXISTS "public_holidays" (
    "id"        TEXT NOT NULL,
    "date"      DATE NOT NULL,
    "name"      TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_holidays_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "public_holidays_date_key" ON "public_holidays"("date");

-- CreateTable absences
CREATE TABLE IF NOT EXISTS "absences" (
    "id"            TEXT NOT NULL,
    "userId"        TEXT NOT NULL,
    "date"          DATE NOT NULL,
    "justified"     BOOLEAN NOT NULL DEFAULT false,
    "justification" TEXT,
    "documentPath"  TEXT,
    "reviewedBy"    TEXT,
    "reviewedAt"    TIMESTAMP(3),
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "absences_userId_date_key" ON "absences"("userId", "date");

ALTER TABLE "absences" ADD CONSTRAINT "absences_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
