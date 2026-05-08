import { createClient } from '@supabase/supabase-js';

// Obtener las credenciales de las variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las credenciales existen
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '❌ Faltan credenciales de Supabase. Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén en tu archivo .env'
    );
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false, // No necesitamos autenticación de usuario por ahora
    },
});

// Helper para verificar la conexión (opcional, útil para debugging)
export async function testSupabaseConnection(): Promise<boolean> {
    try {
        const { error } = await supabase.from('news_cache').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('✅ Conexión a Supabase exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a Supabase:', error);
        return false;
    }
}
