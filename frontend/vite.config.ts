import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sassDts from 'vite-plugin-sass-dts'
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        react(),
        sassDts(),
        svgr(),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                importer: [
                    (url: string) => {
                        if (url.startsWith('@/')) {
                            return {
                                file: resolve(__dirname, 'src', url.slice(2))
                            };
                        }
                        return null;
                    }
                ],
            }
        }
    },
    build: {
        minify: process.env.NODE_ENV === 'production',
        cssMinify: process.env.NODE_ENV === 'production',
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                },
            },
        },
    },
})