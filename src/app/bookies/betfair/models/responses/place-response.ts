export interface PlaceResponse {
  jsonrpc: string;
  result: Result;
  id: string;
}

export interface Result {
  customerRef: string;
  marketId: string;
  instructionReports: InstructionReport[];
  sizeNeeded: number;
  status: string;
  errorCode: string;
}

export interface InstructionReport {
  instruction: Instruction;
  status: string;
  errorCode: string;
}

export interface Instruction {
  selectionId: number;
  handicap: number;
  limitOrder: LimitOrder;
  orderType: string;
  side: string;
}

export interface LimitOrder {
  size: number;
  price: number;
  persistenceType: string;
}
