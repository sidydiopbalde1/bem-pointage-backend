-- AlterTable users: add password reset columns
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordResetExpiry" TIMESTAMP(3);

-- CreateUniqueIndex on passwordResetToken
CREATE UNIQUE INDEX IF NOT EXISTS "users_passwordResetToken_key" ON "users"("passwordResetToken");

-- CreateTable token_blacklist
CREATE TABLE IF NOT EXISTS "token_blacklist" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex on jti
CREATE UNIQUE INDEX IF NOT EXISTS "token_blacklist_jti_key" ON "token_blacklist"("jti");

-- CreateIndex for cleanup queries
CREATE INDEX IF NOT EXISTS "token_blacklist_expiresAt_idx" ON "token_blacklist"("expiresAt");
