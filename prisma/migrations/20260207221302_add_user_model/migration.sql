/*
  Warnings:

  - Added the required column `userId` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT
);

-- Insert default user for existing trades
INSERT INTO "User" ("id", "createdAt", "updatedAt", "login", "password", "name", "surname", "email") 
VALUES ('default-user', datetime('now'), datetime('now'), 'admin', 'hashed_password_placeholder', 'Admin', 'User', 'admin@tradersjournal.com');

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "entryPrice" REAL NOT NULL,
    "exitPrice" REAL,
    "tradeDate" DATETIME NOT NULL,
    "exitDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "profit" REAL,
    "profitPercentage" REAL,
    "setupDescription" TEXT,
    "reasonToBuy" TEXT,
    "reasonToSell" TEXT,
    "mistakes" TEXT,
    "lessonsLearned" TEXT,
    "notes" TEXT,
    "exchangeTradeId" TEXT,
    "exchangeSource" TEXT,
    CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trade" ("createdAt", "entryPrice", "exchangeSource", "exchangeTradeId", "exitDate", "exitPrice", "id", "lessonsLearned", "mistakes", "notes", "profit", "profitPercentage", "quantity", "reasonToBuy", "reasonToSell", "setupDescription", "status", "symbol", "tradeDate", "type", "updatedAt", "userId") SELECT "createdAt", "entryPrice", "exchangeSource", "exchangeTradeId", "exitDate", "exitPrice", "id", "lessonsLearned", "mistakes", "notes", "profit", "profitPercentage", "quantity", "reasonToBuy", "reasonToSell", "setupDescription", "status", "symbol", "tradeDate", "type", "updatedAt", 'default-user' FROM "Trade";
DROP TABLE "Trade";
ALTER TABLE "new_Trade" RENAME TO "Trade";
CREATE INDEX "Trade_userId_idx" ON "Trade"("userId");
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");
CREATE INDEX "Trade_tradeDate_idx" ON "Trade"("tradeDate");
CREATE INDEX "Trade_status_idx" ON "Trade"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_login_idx" ON "User"("login");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
