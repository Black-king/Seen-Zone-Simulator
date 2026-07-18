import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 会把站点部署在 /repo-name/ 下。
// 设置环境变量 VITE_BASE 可以覆盖，比如 VITE_BASE=/seen-zone-simulator/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/seen-zone-simulator/",
});
