import { z } from 'zod';

/**
 * Valida una respuesta que debe ser un array de `itemSchema`.
 * Descarta los ítems inválidos (con console.warn) y devuelve los válidos.
 * Lanza si la respuesta no es un array (error estructural, no se enmascara).
 */
export function parseList<T>(itemSchema: z.ZodType<T>, data: unknown, ctx: string): T[] {
    if (!Array.isArray(data)) {
        throw new Error(`${ctx}: se esperaba un array y llegó ${typeof data}`);
    }

    const valid: T[] = [];
    for (const item of data) {
        const result = itemSchema.safeParse(item);
        if (result.success) {
            valid.push(result.data);
        } else {
            console.warn(`⚠️ ${ctx}: ítem inválido descartado`, result.error.format());
        }
    }
    return valid;
}
