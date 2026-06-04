import { Reviews } from '@/domain/Review';
import { supabase } from '@/shared/lib/supabaseClient';
import { parseList } from '@/shared/lib/parseList';
import { ReviewSchema } from '@/features/reviews/services/review.schema';
import { mapYouTubeToReview } from '@/features/reviews/services/mappers/mapYouTubeToReview';

export async function fetchReviews(): Promise<Reviews> {
    try {
        const { data, error } = await supabase.functions.invoke('get-reviews');

        if (error) throw error;

        const mapped = mapYouTubeToReview(data);
        return parseList(ReviewSchema, mapped, 'get-reviews');
    } catch (error) {
        console.error('❌ Error en fetchReviews:', error);
        throw error;
    }
}
