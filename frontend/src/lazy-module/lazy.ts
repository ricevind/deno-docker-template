console.log("Hello lazy");
fetch("/api/agent")
  .then((response) => response.arrayBuffer())
  .then((buffer) => {
    const u8a = new Uint8Array(buffer);
    const decoder = new TextDecoder();
    return decoder.decode(u8a);
  })
  .then((t) => console.log({ t }))
  .catch((e) => console.error(e));
