export const getUserAgent = (request: Request) => {
  const body = `Your user-agent is: \n\n ${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  const multipliedBody = Array.from({ length: 300 }, () => body).join(" ");

  return new Response(multipliedBody, { status: 200 });
};
