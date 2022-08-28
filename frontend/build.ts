import { dirname, emptyDir, esbuild, fromFileUrl, join } from "../deps.ts";

const BUILD_DESTINATION_FOLDER = "dist";
const ENTRY_FILE = "src/index.ts";

const entryPoint = joinWithRoot(ENTRY_FILE);
const outdir = await prepareDestinationFolrder(BUILD_DESTINATION_FOLDER);

await esbuild.build({
  entryPoints: [entryPoint],
  outdir,
  platform: "browser",
  splitting: true,
  sourcemap: true,
  minify: true,
  format: "esm",
  target: ["esnext"],
  bundle: true,
}).finally(() => esbuild.stop());

async function prepareDestinationFolrder(destinationFolderName: string) {
  const dist = joinWithRoot(destinationFolderName);
  await emptyDir(dist);

  return dist;
}

function joinWithRoot(path: string) {
  const root = dirname(fromFileUrl(import.meta.url));

  return join(root, path);
}
