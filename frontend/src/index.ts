import { listenEvents } from "./test/sse.ts";

const template = document.createElement("div");

const randomValue: number = Math.random();

template.innerHTML = `
    <h1>Hello motto ${randomValue}</h2>
`;

fetch("/api/agent")
  .then((response) => response.arrayBuffer())
  .then((buffer) => {
    const u8a = new Uint8Array(buffer);
    const decoder = new TextDecoder();
    return decoder.decode(u8a);
  })
  .then((t) => console.log({ t }))
  .catch((e) => console.error(e));

document.querySelector("body")?.appendChild(template);

const list = document.createElement("ul");
document.querySelector("body")?.appendChild(list);

Array.from({ length: 20 }, () => drawEvent(listenEvents("/api/sse")));

function drawEvent(events: ReturnType<typeof listenEvents>) {
  const li = document.createElement("li");

  events.subscribe((sse) => {
    li.textContent = sse.data as string;
    list.appendChild(li);
  });
}

setTimeout(async () => {
  const mod = await import("./test/test.ts");
  mod.errorMe("kupa");
}, 2000);
