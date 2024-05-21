# agnostic-ws

[isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) is jank
and basically does a dumb switch on platform without trying to do any sort of compat
behaviour between `ws` and the Brower's WebSocket

this is a very thing comptability shim around both WebSockets that 
satisfies a common subset of the two APIs

the type definition is as follows:

```ts
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
```
