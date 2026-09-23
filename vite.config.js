import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    envDir: ".",

    define: {
      "import.meta.env.VITE_FIREBASE_KEY": JSON.stringify(
        env.VITE_FIREBASE_KEY,
      ),
      "import.meta.env.VITE_DB_URL": JSON.stringify(env.VITE_DB_URL),
    },
  };
});
