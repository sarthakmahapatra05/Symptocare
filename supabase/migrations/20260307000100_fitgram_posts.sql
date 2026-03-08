CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.fitgram_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL CHECK (char_length(trim(content)) > 0),
  image TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  likes_count INTEGER NOT NULL DEFAULT 0 CHECK (likes_count >= 0),
  comments_count INTEGER NOT NULL DEFAULT 0 CHECK (comments_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.fitgram_posts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fitgram_posts'
      AND policyname = 'Authenticated users can read fitgram posts'
  ) THEN
    CREATE POLICY "Authenticated users can read fitgram posts"
      ON public.fitgram_posts
      FOR SELECT
      USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fitgram_posts'
      AND policyname = 'Users can create own fitgram posts'
  ) THEN
    CREATE POLICY "Users can create own fitgram posts"
      ON public.fitgram_posts
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fitgram_posts'
      AND policyname = 'Users can update own fitgram posts'
  ) THEN
    CREATE POLICY "Users can update own fitgram posts"
      ON public.fitgram_posts
      FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'fitgram_posts'
      AND policyname = 'Users can delete own fitgram posts'
  ) THEN
    CREATE POLICY "Users can delete own fitgram posts"
      ON public.fitgram_posts
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS fitgram_posts_created_at_idx
  ON public.fitgram_posts (created_at DESC);
