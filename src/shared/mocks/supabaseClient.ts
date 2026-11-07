import type { SupabaseClient } from '@supabase/supabase-js';

// Sustituto de `shared/lib/supabaseClient.ts` en Jest (ver moduleNameMapper en jest.config.js).
// El original lee `import.meta.env`, que no existe fuera de Vite. Los tests inyectan
// Mock*Repository en los hooks, así que el cliente nunca debería usarse: si algún test
// lo toca por error, este Proxy lo hace fallar con un mensaje claro en vez de llamar a la red.
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        throw new Error(
            `supabase.${String(prop)} se ha llamado en un test. Inyecta un Mock*Repository en lugar del repositorio real.`
        );
    },
});

export async function testSupabaseConnection(): Promise<boolean> {
    return false;
}
