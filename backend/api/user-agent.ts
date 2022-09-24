import { Route, RouteHandler } from "../router.ts";

const getUserAgent: RouteHandler = (request: Request) => {
  const body = `Your user-agent is: \n\n ${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  const multipliedBody = Array.from({ length: 300 }, () => body).join(" ");

  return new Response(multipliedBody, { status: 200 });
};

export const getUserAgentRoute: Route = {
  handler: getUserAgent,
  matcher: ({ url }) => {
    const { pathname } = new URL(url);
    const paths = pathname.split("/");

    return paths.at(-1) === "agent";
  },
};
