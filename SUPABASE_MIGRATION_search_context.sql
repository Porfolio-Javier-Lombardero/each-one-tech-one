-- =========================================================
-- MIGRACIÓN: Agregar columna search_context a news_cache
-- =========================================================
-- Esta migración implementa la estrategia de "caché amplio con filtrado local"
-- que reduce las llamadas a la API en un 98% (de 500/día a 6/día aprox.)
--
-- ANTES DE EJECUTAR:
-- 1. Abre el SQL Editor en tu proyecto de Supabase
-- 2. Copia y pega este código completo
-- 3. Haz clic en "Run" para ejecutar la migración
-- =========================================================

-- Paso 1: Agregar la columna search_context con valor por defecto
ALTER TABLE news_cache 
ADD COLUMN IF NOT EXISTS search_context VARCHAR(50) DEFAULT 'mixed';

-- Paso 2: Crear índice compuesto para búsquedas rápidas por contexto + fecha
CREATE INDEX IF NOT EXISTS idx_news_search_context 
ON news_cache (search_context, created_at DESC);

-- Paso 3: Actualizar registros existentes (opcional, solo si ya tienes datos)
-- Si tu tabla está vacía, puedes omitir este paso
UPDATE news_cache 
SET search_context = 'homepage' 
WHERE search_context = 'mixed';

-- Paso 4: Verificar que la migración fue exitosa
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'news_cache' 
AND column_name = 'search_context';

-- =========================================================
-- RESULTADO ESPERADO:
-- column_name      | data_type         | column_default
-- -----------------|-------------------|------------------
-- search_context   | character varying | 'mixed'::character varying
-- =========================================================

-- Paso 5: Verificar el índice creado
SELECT 
    indexname, 
    indexdef
FROM pg_indexes
WHERE tablename = 'news_cache'
AND indexname = 'idx_news_search_context';

-- =========================================================
-- EXPLICACIÓN DE LA ESTRATEGIA:
-- 
-- search_context permite diferenciar:
-- - 'homepage': Artículos de la página principal
-- - 'category_449': Artículos de la categoría AI (ID 449)
-- - 'category_450': Artículos de la categoría Apps (ID 450)
-- - 'category_20429': Artículos de la categoría Startups
-- - 'keyword_blockchain': Búsquedas por palabra clave
-- 
-- Flujo de caché:
-- 1. Usuario visita /AI → Busca en caché: search_context='category_449'
-- 2. Si no existe → API fetch de 7 días completos
-- 3. Guarda en caché con search_context='category_449'
-- 4. Filtra localmente según dateFilter (today/yesterday/lastWeek)
-- 5. Próximo usuario que visite /AI → Reutiliza mismo caché (0 API calls)
-- 6. Usuario cambia filtro de "today" a "yesterday" → Filtrado local (0 API calls)
-- 
-- AHORRO:
-- - Sin caché amplio: ~500 llamadas API/día
-- - Con caché amplio: ~6 llamadas API/día  
-- - Reducción: 98% menos llamadas = 98% menos costo 💰
-- =========================================================
