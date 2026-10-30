import { existsSync } from 'node:fs'
import { defineConfig } from 'vitest/config'

// Credentials stay in an ignored server-side file, never Vite's browser env.
if (existsSync('.env.integration.local')) process.loadEnvFile('.env.integration.local')
export default defineConfig({ test: { environment: 'node', include: ['tests/integration/**/*.test.ts'], fileParallelism: false } })
