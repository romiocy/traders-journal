// src/types/trade.ts

export interface Trade {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  symbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  tradeDate: Date;
  exitDate?: Date;
  status: "OPEN" | "CLOSED";
  profit?: number;
  profitPercentage?: number;
  setupDescription?: string;
  reasonToBuy?: string;
  reasonToSell?: string;
  mistakes?: string;
  lessonsLearned?: string;
  notes?: string;
  exchangeTradeId?: string;
  exchangeSource?: string;
}

export interface CreateTradePayload {
  symbol: string;
  type: "BUY" | "SELL";
  quantity: number;
  entryPrice: number;
  tradeDate: Date;
  setupDescription?: string;
  reasonToBuy?: string;
}

export interface UpdateTradePayload {
  exitPrice?: number;
  exitDate?: Date;
  status?: "OPEN" | "CLOSED";
  reasonToSell?: string;
  mistakes?: string;
  lessonsLearned?: string;
  notes?: string;
}
