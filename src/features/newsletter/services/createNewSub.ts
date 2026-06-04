import { supabase } from '@/shared/lib/supabaseClient';
import { Subscriber } from '@/domain/Subscriber';

const createNewSub = async (newSub: Subscriber): Promise<void> => {
    try {
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert(newSub);           // sin .select() ≈ Prefer: return=minimal

        if (error) throw error;
    } catch (error) {
        console.error('❌ Error en createNewSub:', error);
        throw error; // re-throw para que useMutation capture el onError
    }
};

export default createNewSub;
