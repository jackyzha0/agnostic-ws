import { WebSocket as NodeWebSocket } from "ws";
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

export default class WebSocket implements AgnosticWebSocket {
  static readonly CONNECTING = ReadyState.CONNECTING;
  static readonly OPEN = ReadyState.OPEN;
  static readonly CLOSING = ReadyState.CLOSING;
  static readonly CLOSED = ReadyState.CLOSED;
  readyState = ReadyState.CONNECTING;
  binaryType = "arraybuffer" as const;

  private ws: NodeWebSocket;
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
  
  static from(ws: NodeWebSocket): WebSocket {
    return new WebSocket(ws);
  }

  constructor(ws: NodeWebSocket)
  constructor(url: string)
  constructor(urlOrWs: string | NodeWebSocket) {
    this.ws = typeof urlOrWs === "string" ? new NodeWebSocket(urlOrWs) : urlOrWs;
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
        error: evt.error,
      };

      this.onerror?.(syntheticEvent);
    };

    this.ws.onmessage = (evt) => {
      if (!(evt.data instanceof Buffer) && !(evt.data instanceof ArrayBuffer)) {
        throw new Error("Expected data to be a BufferLike");
      }

      const syntheticEvent: MessageEvent = {
        target: this,
        type: "message",
        data: new Uint8Array(evt.data),
      };

      this.onmessage?.(syntheticEvent);
    };
  }
}

export * from "./types";
