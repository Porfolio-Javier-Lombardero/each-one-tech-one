// Configuración de Jest.
// El proyecto es "type": "module", así que este archivo es ESM (export default).
// Los tests (.ts/.tsx) se transforman con ts-jest a CommonJS usando tsconfig.jest.json.

/** @type {import('jest').Config} */
export default {
  // jsdom simula el DOM del navegador (necesario para renderHook/render de RTL).
  testEnvironment: 'jsdom',

  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.{test,spec}.{ts,tsx}'],

  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },

  moduleNameMapper: {
    // El cliente real usa `import.meta.env` (sintaxis exclusiva de Vite/ESM) y lanza
    // si faltan las env vars. En tests nunca se usa: los hooks reciben Mock*Repository.
    // IMPORTANTE: debe ir ANTES del alias '@/', porque Jest usa la primera regla que coincide.
    '^@/shared/lib/supabaseClient$': '<rootDir>/src/shared/mocks/supabaseClient.ts',

    // Replica el alias '@/' de vite.config.ts / tsconfig.
    '^@/(.*)$': '<rootDir>/src/$1',

    // Jest no sabe importar estilos ni assets: se sustituyen por stubs.
    '\\.(css|scss|sass)$': '<rootDir>/jest/styleMock.cjs',
    '\\.(png|jpe?g|gif|svg|webp|avif)$': '<rootDir>/jest/fileMock.cjs',
  },

  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.ts'],

  clearMocks: true,
};
