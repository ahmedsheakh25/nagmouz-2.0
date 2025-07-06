import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  external: [
    "react",
    "next-themes",
    "@supabase/auth-helpers-nextjs",
    "next/navigation",
    "@radix-ui/react-label",
    "@radix-ui/react-toast",
    "lucide-react",
  ],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
}); 