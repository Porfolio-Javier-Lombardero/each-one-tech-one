
| table_name    | column_name    | data_type                | is_nullable |
| ------------- | -------------- | ------------------------ | ----------- |
| events_cache  | id             | bigint                   | NO          |
| events_cache  | event_date     | text                     | NO          |
| events_cache  | event_name     | text                     | NO          |
| events_cache  | event_city     | text                     | NO          |
| events_cache  | event_url      | text                     | YES         |
| events_cache  | source         | text                     | YES         |
| events_cache  | raw_text       | text                     | NO          |
| events_cache  | created_at     | timestamp with time zone | YES         |
| events_cache  | updated_at     | timestamp with time zone | YES         |
| events_cache  | fetch_count    | integer                  | YES         |
| news_cache    | techcrunch_id  | bigint                   | NO          |
| news_cache    | source         | character varying        | NO          |
| news_cache    | titulo         | text                     | YES         |
| news_cache    | description    | text                     | YES         |
| news_cache    | cont           | text                     | YES         |
| news_cache    | categories     | ARRAY                    | YES         |
| news_cache    | fecha_iso      | timestamp with time zone | NO          |
| news_cache    | url            | text                     | NO          |
| news_cache    | img            | text                     | YES         |
| news_cache    | created_at     | timestamp with time zone | NO          |
| news_cache    | updated_at     | timestamp with time zone | NO          |
| news_cache    | fetch_count    | integer                  | NO          |
| news_cache    | id             | bigint                   | NO          |
| news_cache    | search_context | character varying        | YES         |
| reviews_cache | id             | bigint                   | NO          |
| reviews_cache | video_id       | text                     | NO          |
| reviews_cache | title          | text                     | NO          |
| reviews_cache | description    | text                     | YES         |
| reviews_cache | thumbnail_url  | text                     | YES         |
| reviews_cache | channel_title  | text                     | YES         |
| reviews_cache | published_at   | timestamp with time zone | NO          |
| reviews_cache | source         | text                     | YES         |
| reviews_cache | video_kind     | text                     | YES         |
| reviews_cache | created_at     | timestamp with time zone | YES         |
| reviews_cache | updated_at     | timestamp with time zone | YES         |
| reviews_cache | fetch_count    | integer                  | YES         |
