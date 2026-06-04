import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { mockEventRepository } from '@/shared/mocks/MockEventRepository';
import { useGetEvents } from '../useGetEvents';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

it('returns events from the repository', async () => {
    const { result } = renderHook(
        () => useGetEvents(mockEventRepository),
        { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.events).toHaveLength(2);
    expect(result.current.events![0].title).toBe('Tech Conference 2026');
});
