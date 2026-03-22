-- AlterTable users: add work schedule columns
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "workStartTime" TEXT NOT NULL DEFAULT '09:00';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "workEndTime"   TEXT NOT NULL DEFAULT '17:00';
