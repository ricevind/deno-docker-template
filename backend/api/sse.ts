import { Route, RouteHandler } from "../router.ts";

const handleSSE: RouteHandler = () => {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "text/event-stream",
  });
  const textEncoder = new TextEncoder();

  const events = new ReadableStream({
    start(ctrl) {
      const message = () => {
        const message = `data: "${Math.random()}"\n\n`;
        ctrl.enqueue(textEncoder.encode(message));
      };

      message();
      setInterval(() => {
        message();
      }, 5000);
    },
  });

  return new Response(events, { headers });
};

export const handleSSERoute: Route = {
  handler: handleSSE,
  matcher: ({ url }) => {
    const { pathname } = new URL(url);
    const paths = pathname.split("/");

    return paths.at(-1) === "sse";
  },
};
