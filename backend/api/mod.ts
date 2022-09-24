import { Router, router } from "../router.ts";
import { handleSSERoute } from "./sse.ts";
import { getUserAgentRoute } from "./user-agent.ts";

const apiRouter = new Router();

apiRouter.addRoute(handleSSERoute);
apiRouter.addRoute(getUserAgentRoute);

router.addRoute({
  matcher: ({ url }) => url.includes("api"),
  handler: (req: Request) => apiRouter.handleRequest(req),
});
