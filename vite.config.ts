import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const apiBaseUrl = env.VITE_API_BASE_URL || 'http://scam-detection.ap-northeast-1.elasticbeanstalk.com'
    const apiPrefix = env.VITE_API_PREFIX || '/anti-scaq/api'

    return {
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            proxy: {
                // Chuyển hướng các request /api sang backend thật (cấu hình qua .env)
                '/api': {
                    target: apiBaseUrl,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, apiPrefix),
                }
            }
        }
    }
})
