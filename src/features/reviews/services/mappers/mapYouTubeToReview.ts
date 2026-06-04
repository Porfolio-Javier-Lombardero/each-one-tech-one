import type { SearchResultItem } from '../dtos/d.reviews.types';
import type { Review } from '@/domain/Review';

export function mapYouTubeToReview(items: SearchResultItem[]): Review[] {
  return items.map((item) => ({
    video_id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description || '',
    thumbnail_url: item.snippet.thumbnails.high.url || '',
    channel_title: item.snippet.channelTitle || '',
    published_at: item.snippet.publishedAt,
    video_kind: item.id.kind || 'youtube#video',
  }));
}
