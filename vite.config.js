import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    build: {
        outDir: 'dist'
    },

    server: {
        proxy: {
            '/api': 'https://seu-backend.railway.app'
        }
    },

    plugins: [react()],
});