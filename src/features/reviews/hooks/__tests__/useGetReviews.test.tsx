import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { mockReviewRepository } from '@/shared/mocks/MockReviewRepository';
import { useGetReviews } from '../useGetReviews';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

it('returns reviews from the repository', async () => {
    const { result } = renderHook(
        () => useGetReviews(mockReviewRepository),
        { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.reviews).toHaveLength(2);
    expect(result.current.reviews![0].video_id).toBe('vid_001');
});
