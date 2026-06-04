import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { mockArticleRepository } from '@/shared/mocks/MockArticleRepository';
import { useGetHeadlines } from '../useGetHeadlines';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

it('returns articles from the repository', async () => {
    const { result } = renderHook(
        () => useGetHeadlines({ topic: 0, dateFilter: 'all' }, mockArticleRepository),
        { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.news).toHaveLength(2);
    expect(result.current.news[0].id_hash).toBe('abc123');
});
