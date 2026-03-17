import { H as HTTPError, t as toRequest } from "../_libs/h3.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
function fetchViteEnv(viteEnvName, input, init) {
  const envs = globalThis.__nitro_vite_envs__ || {};
  const viteEnv = envs[viteEnvName];
  if (!viteEnv) {
    throw HTTPError.status(404);
  }
  return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
function ssrRenderer({ req }) {
  return fetchViteEnv("ssr", req);
}
export {
  ssrRenderer as default
};
