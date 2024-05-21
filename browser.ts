import {
  AgnosticWebSocket,
  BufferLike,
  CloseHandler,
  ErrorHandler,
  MessageHandler,
  OpenEvent,
  ErrorEvent,
  MessageEvent,
  CloseEvent,
  OpenHandler,
  ReadyState
} from "./types";

export class WebSocket implements AgnosticWebSocket {
  static readonly CONNECTING = ReadyState.CONNECTING;
  static readonly OPEN = ReadyState.OPEN;
  static readonly CLOSING = ReadyState.CLOSING;
  static readonly CLOSED = ReadyState.CLOSED;
  readyState = ReadyState.CONNECTING;
  binaryType = "arraybuffer" as const;

  private ws: globalThis.WebSocket;
  onopen: OpenHandler | null = null;
  onclose: CloseHandler | null = null;
  onerror: ErrorHandler | null = null;
  onmessage: MessageHandler | null = null;

  send(data: BufferLike) {
    return this.ws.send(data);
  }

  close(code?: number, reason?: string) {
    this.ws.close(code, reason);
  }
  
  static from(ws: globalThis.WebSocket): WebSocket {
    return new WebSocket(ws);
  }

  constructor(ws: globalThis.WebSocket)
  constructor(url: string)
  constructor(urlOrWs: string | globalThis.WebSocket) {
    this.ws = typeof urlOrWs === "string" ? new globalThis.WebSocket(urlOrWs) : urlOrWs;
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = (_) => {
      this.readyState = WebSocket.OPEN;
      const syntheticEvent: OpenEvent = {
        target: this,
        type: "open",
      };

      this.onopen?.(syntheticEvent);
    };

    this.ws.onclose = (evt) => {
      this.readyState = WebSocket.CLOSED;
      const syntheticEvent: CloseEvent = {
        target: this,
        type: "close",
        code: evt.code,
        reason: evt.reason,
        wasClean: evt.wasClean,
      };

      this.onclose?.(syntheticEvent);
    };

    this.ws.onerror = (evt) => {
      this.readyState = WebSocket.CLOSED;
      const syntheticEvent: ErrorEvent = {
        target: this,
        type: "error",
        error: new Error(evt.toString()),
      };

      this.onerror?.(syntheticEvent);
    };

    this.ws.onmessage = (evt) => {
      const syntheticEvent: MessageEvent = {
        target: this,
        type: "message",
        data: evt.data,
      };

      this.onmessage?.(syntheticEvent);
    };
  }
}

export * from "./types";
