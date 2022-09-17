import { ConnInfo, Handler, staticFiles } from "../deps.ts";

const apiPattern = /\/api\/.*/;
const distPattern = /\/dist\/.*/;
const staticPattern = /\/static\/.*/;
const indexPattern = /^(\/)?$/;

const serveStatic = (req: Request) =>
  staticFiles.default(".")({
    request: req,
    respondWith: (r: Response) => r,
  });

const serveDist = (req: Request) =>
  staticFiles.default("./frontend")({
    request: req,
    respondWith: (r: Response) => r,
  });

const serveIndex = (req: Request) =>
  staticFiles.default("./static")({
    request: req,
    respondWith: (r: Response) => r,
  });

const handleApi = (req: Request) => {
  const pathName = new URL(req.url).pathname;

  if (pathName.includes("agent")) {
    const body = `Your user-agent is: \n\n ${
      req.headers.get("user-agent") ?? "Unknown"
    }`;

    const multipliedBody = Array.from({ length: 300 }, () => body).join(" ");

    return new Response(multipliedBody, { status: 200 });
  }

  if (pathName.includes("sse")) {
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
  }

  return new Response("not known route", { status: 400 });
};

const routesMapping = new Map<RegExp, Handler>([
  [apiPattern, handleApi],
  [distPattern, serveDist],
  [staticPattern, serveStatic],
  [indexPattern, serveIndex],
]);

const handler = (request: Request, connInfo: ConnInfo) => {
  const url = new URL(request.url);
  const path = url.pathname;

  for (const [routePattern, routeHandler] of routesMapping) {
    if (routePattern.test(path)) {
      return routeHandler(request, connInfo);
    }
  }

  const unhandledPathError = new Error(`Path ${path} was not handled`);
  console.warn(unhandledPathError);

  return Response.redirect(`${url.protocol}${url.host}/`);
};

const port = 8443;
const certFile = "./localhost_cert/localhost.crt";
const keyFile = "./localhost_cert/localhost.key";

for await (const conn of Deno.listenTls({
  port,
  certFile,
  keyFile,
  alpnProtocols: ["h2", "http/1.1"],
})) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    requestEvent.respondWith(handler(requestEvent.request, conn));
  }
}
