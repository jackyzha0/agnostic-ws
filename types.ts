export type BufferLike =
  | Buffer
  | Uint8Array;

export type OpenEvent = {
  target: AgnosticWebSocket;
  type: "open";
}

export type CloseEvent = {
  target: AgnosticWebSocket;
  type: "close";
  code: number;
  reason: string;
  wasClean: boolean;
}

export type MessageEvent = {
  target: AgnosticWebSocket;
  type: "message";
  data: BufferLike;
}

export type ErrorEvent = {
  target: AgnosticWebSocket;
  type: "error";
  error: Error;
}

export type OpenHandler = (ev: OpenEvent) => void;
export type CloseHandler = (ev: CloseEvent) => void;
export type MessageHandler = (ev: MessageEvent) => void;
export type ErrorHandler = (ev: ErrorEvent) => void;

export const enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

// Opinionated types for the agnostic WebSocket API
export interface AgnosticWebSocket {
  readyState: ReadyState;
  readonly binaryType: "arraybuffer";
  onopen: OpenHandler | null;
  onclose: CloseHandler | null;
  onerror: ErrorHandler | null;
  onmessage: MessageHandler | null;

  send(data: BufferLike): void
  close(code?: number, reason?: string): void
}
