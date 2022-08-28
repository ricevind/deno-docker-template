import { ConnInfo, Handler, serve, staticFiles } from "../deps.ts";

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
  const body = `Your user-agent is: \n\n ${
    req.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 300 });
};

const routesMapping = new Map<RegExp, Handler>(
  [
    [apiPattern, handleApi],
    [distPattern, serveDist],
    [
      staticPattern,
      serveStatic,
    ],
    [
      indexPattern,
      serveIndex,
    ],
  ],
);

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

const port = 8080;

const startWebServer = ({
  port,
}: {
  port: number;
}): Promise<void> => {
  return serve(handler, { port });
};

await startWebServer({ port });
