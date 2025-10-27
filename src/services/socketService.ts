// src/services/socketService.ts
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Subject, timer, merge, EMPTY, Observable } from "rxjs";
import { retryWhen, delayWhen, tap, catchError, map } from "rxjs/operators";

// Define message shapes
export interface ServerMessage {
  type: "NOTIFY" | "ECHO" | "WELCOME";
  text?: string;
  data?: string;
  time?: string | number | Date;
}

export interface ClientMessage {
  type: "PING" | "MESSAGE";
  text?: string;
  time?: number;
}

const SERVER_URL = "ws://localhost:8080";

// outgoing messages Subject
const outgoing$ = new Subject<ClientMessage>();

// Create the WebSocketSubject
const socket$: WebSocketSubject<ServerMessage | ClientMessage> = webSocket({
  url: SERVER_URL,
  openObserver: {
    next: () => console.log("[WS] Connected ✅"),
  },
  closeObserver: {
    next: () => console.log("[WS] Disconnected ❌"),
  },
});

// Handle reconnects and incoming messages
const connection$: Observable<ServerMessage> = socket$.pipe(
  map((value: any) => {
    if (value > 5) {
      // error will be picked up by retryWhen
      throw value;
    }
    return value;
  }),
  retryWhen((errors) =>
    errors.pipe(
      tap((value) => console.log(`Value ${value} was too high!`)),
      delayWhen((value) => timer(value * 1000))
    )
  )
);

// Merge outgoing stream (for sending)
merge(outgoing$.pipe(tap((msg) => socket$.next(msg)))).subscribe();

export const socketService = {
  messages$: connection$,
  send: (msg: ClientMessage) => outgoing$.next(msg),
};
