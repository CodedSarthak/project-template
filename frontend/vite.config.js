import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(function (_a) {
    var _b;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react(), tailwindcss()],
        server: {
            host: '0.0.0.0',
            port: 5173,
            proxy: {
                '/api': {
                    target: (_b = env.BACKEND_API_URL) !== null && _b !== void 0 ? _b : 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        preview: {
            host: '0.0.0.0',
            port: 4173,
        },
    };
});
