const template = document.createElement("div");

const randomValue: number = Math.random();

template.innerHTML = `
    <h1>Hello motto ${randomValue}</h2>
`;

document.querySelector("body")?.appendChild(template);

setTimeout(async () => {
  const mod = await import("./test/test.ts");
  mod.errorMe("kupa");
}, 2000);
