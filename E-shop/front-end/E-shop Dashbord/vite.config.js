import fs from "node:fs";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function readEnvFile(file) {
  const raw = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
  return env;
}

export default defineConfig(({ mode }) => {
  // import.meta.env is inlined at build time, so a production bundle that picks
  // up the localhost value from .env gets deployed as-is and every API call runs
  // against the visitor's own machine instead of the API host. Refuse to emit
  // that bundle rather than shipping a login form that can never succeed.
  let apiBase;
  if (mode === "production") {
    // loadEnv lets process.env beat .env files, so a leftover VITE_URL_BASE in
    // the build environment (e.g. the Render dashboard) overrides the committed
    // .env.production. When the env value is not https, recover from the file.
    apiBase = (loadEnv(mode, process.cwd(), "VITE_").VITE_URL_BASE || "").trim();

    if (!apiBase.startsWith("https://")) {
      const fromFile = (readEnvFile(".env.production").VITE_URL_BASE || "").trim();
      if (fromFile.startsWith("https://")) {
        console.warn(
          `[vite] ignoring non-https VITE_URL_BASE "${apiBase}" from the build ` +
            `environment; using "${fromFile}" from .env.production.`
        );
        apiBase = fromFile;
      } else {
        throw new Error(
          `VITE_URL_BASE must be an https:// URL for a production build, got "${apiBase}". ` +
            `Set it in .env.production, or as a VITE_URL_BASE build variable if the host ` +
            `overrides it -- a VITE_URL_BASE in the build environment takes priority over ` +
            `the .env.production file, so check the service's environment variables too.`
        );
      }
    }
  }

  return {
    plugins: [tailwindcss(), react()],
    server: {
      port: 5173,
    },
    // Pin the value that replaces import.meta.env.VITE_URL_BASE so the bundle
    // ships the resolved API URL even when the build environment carries a
    // stale (non-https) value that Vite's own env inlining would otherwise use.
    define: apiBase ? { "import.meta.env.VITE_URL_BASE": JSON.stringify(apiBase) } : {},
  };
});
