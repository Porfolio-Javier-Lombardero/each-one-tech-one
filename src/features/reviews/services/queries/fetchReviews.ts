import { Reviews } from '@/domain/Review';
import { supabase } from '@/shared/lib/supabaseClient';
import { parseList } from '@/shared/lib/parseList';
import { ReviewSchema } from '@/features/reviews/services/review.schema';
import { mapYouTubeToReview } from '@/features/reviews/services/mappers/mapYouTubeToReview';

const FUNCTION_NAME = 'get-reviews';

export async function fetchReviews(): Promise<Reviews> {
    try {
        const { data, error } = await supabase.functions.invoke(FUNCTION_NAME);

        if (error) throw error;

        const mapped = mapYouTubeToReview(data);
        return parseList(ReviewSchema, mapped, FUNCTION_NAME);
    } catch (error) {
        console.error('❌ Error en fetchReviews:', error);
        throw error;
    }
}
