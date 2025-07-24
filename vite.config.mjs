import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react({
            include: "**/*.{jsx,js,ts,tsx}",
        }), tailwindcss()
    ],
    root: ".",
    build: {
        emptyOutDir: true,
        sourcemap: true,
    },
    resolve: {
        alias: {
            // Add aliases to match the import paths used in the project
            "@": path.resolve(__dirname, "."),
            app: path.resolve(__dirname, "app"),
            components: path.resolve(__dirname, "components"),
            lib: path.resolve(__dirname, "lib"),
            styles: path.resolve(__dirname, "styles"),
            public: path.resolve(__dirname, "public"),
        },
    },
    server: {
        port: 3001, // Match the port used in the dev script
    },
});
