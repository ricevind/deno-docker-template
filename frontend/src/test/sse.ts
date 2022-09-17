type EventsObserver = (ev: MessageEvent<unknown>) => void;

export const listenEvents = (src: string) => {
  const SSE = new EventSource(src);

  const observers: Array<EventsObserver> = [];

  SSE.onmessage = (event) => {
    observers.forEach((observer) => observer(event));
  };

  return ({
    subscribe: (obs: EventsObserver) => {
      observers.push(obs);
      return () => observers.filter((o) => o !== obs);
    },
    close: () => SSE.close(),
  });
};
