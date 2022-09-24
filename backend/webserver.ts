import { ConnInfo, Handler, staticFiles } from "../deps.ts";
import { router } from "./router.ts";
import "./api/mod.ts";

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

const routesMapping = new Map<RegExp, Handler>([
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

  try {
    return router.handleRequest(request);
  } catch (e) {
    console.error(e);

    return Response.redirect(`${url.protocol}${url.host}/`);
  }
};

const port = 8443;
const certFile = "./localhost_cert/localhost.crt";
const keyFile = "./localhost_cert/localhost.key";

for await (
  const conn of Deno.listenTls({
    port,
    certFile,
    keyFile,
    alpnProtocols: ["h2", "http/1.1"],
  })
) {
  serveHttp(conn);
}

async function serveHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    requestEvent.respondWith(handler(requestEvent.request, conn));
  }
}
