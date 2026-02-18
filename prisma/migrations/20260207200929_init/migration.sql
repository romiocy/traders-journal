-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    "exchangeSource" TEXT
);

-- CreateTable
CREATE TABLE "ExchangeAPI" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Trade_symbol_idx" ON "Trade"("symbol");

-- CreateIndex
CREATE INDEX "Trade_tradeDate_idx" ON "Trade"("tradeDate");

-- CreateIndex
CREATE INDEX "Trade_status_idx" ON "Trade"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeAPI_name_key" ON "ExchangeAPI"("name");
