import { Newsub } from './d.newsub.types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const createNewSub = async (newSub: Newsub): Promise<void> => {

    const url = `${SUPABASE_URL}/rest/v1/newsletter_subscribers`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'apikey': SUPABASE_ANON_KEY,
                'Prefer': 'return=minimal' // no devuelve el row insertado, más eficiente
            },
            body: JSON.stringify(newSub),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP error: ${response.status}`);
        }

    } catch (error) {
        console.error('❌ Error en createNewSub:', error);
        throw error; // re-throw para que useMutation capture el onError
    }
}

export default createNewSub