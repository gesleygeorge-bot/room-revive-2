/*
# Create projects and generations tables for Room Revive

## Overview
Sets up the minimal database schema for an authenticated room-makeover app.
Signed-in users upload a living-room photo (a "project"), then generate
styled makeovers ("generations") from it. Each user can only see and manage
their own projects and generations.

## 1. New Tables

### projects
- `id` (uuid, primary key) — unique project identifier
- `user_id` (uuid, not null, defaults to auth.uid()) — owner of the project,
  references auth.users with ON DELETE CASCADE so deleting a user removes
  their projects
- `original_path` (text, not null) — storage path to the uploaded living-room
  photo in the `room-originals` bucket (e.g. "<user-id>/<project-id>.jpg")
- `created_at` (timestamptz, defaults to now()) — when the project was created

### generations
- `id` (uuid, primary key) — unique generation identifier
- `project_id` (uuid, not null) — references projects.id with ON DELETE CASCADE,
  so deleting a project removes its generations
- `user_id` (uuid, not null, defaults to auth.uid()) — owner, references auth.users
  with ON DELETE CASCADE
- `style` (text, not null) — the design style applied (modern, minimalist, traditional)
- `result_path` (text, nullable) — storage path to the generated result image in
  the `room-results` bucket; null until generation completes
- `status` (text, not null, defaults to 'pending') — lifecycle state:
  pending → processing → completed / failed
- `error_message` (text, nullable) — populated only when status = 'failed'
- `created_at` (timestamptz, defaults to now()) — when the generation was requested

## 2. Indexes
- `generations.project_id` — speeds up fetching all generations for a project
- `generations.user_id` — speeds up listing a user's generations
- `projects.user_id` — speeds up listing a user's projects

## 3. Security (Row Level Security)
Both tables have RLS enabled with four policies each (SELECT, INSERT, UPDATE,
DELETE), scoped to `TO authenticated` with ownership checks via `auth.uid() = user_id`.
The `user_id` column defaults to `auth.uid()` so frontend inserts that omit
`user_id` still satisfy the WITH CHECK policy.

## 4. Storage Buckets
Two private storage buckets are created:
- `room-originals` — holds user-uploaded living-room photos
- `room-results` — holds AI-generated makeover images

Storage policies enforce that authenticated users can only read/write objects
whose path begins with their own user ID prefix (e.g. "<user-id>/...").

## 5. Important Notes
1. The service-role key is NEVER used in browser code. Only the anon key is
   used client-side; all privileged operations go through RLS-protected tables
   and storage policies.
2. The `user_id DEFAULT auth.uid()` on both tables means the frontend can insert
   without passing user_id — the database fills it from the session.
3. ON DELETE CASCADE on foreign keys ensures cleanup when a user or project is
   removed.
*/

-- ──────────────────────────────────────────────
-- Tables
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  original_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  style text NOT NULL,
  result_path text,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ──────────────────────────────────────────────
-- Indexes
-- ──────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_project_id ON generations(project_id);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);

-- ──────────────────────────────────────────────
-- Row Level Security — projects
-- ──────────────────────────────────────────────

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_projects" ON projects;
CREATE POLICY "select_own_projects" ON projects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_projects" ON projects;
CREATE POLICY "update_own_projects" ON projects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_projects" ON projects;
CREATE POLICY "delete_own_projects" ON projects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- Row Level Security — generations
-- ──────────────────────────────────────────────

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_generations" ON generations;
CREATE POLICY "select_own_generations" ON generations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_generations" ON generations;
CREATE POLICY "insert_own_generations" ON generations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_generations" ON generations;
CREATE POLICY "update_own_generations" ON generations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_generations" ON generations;
CREATE POLICY "delete_own_generations" ON generations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────
-- Storage Buckets (private)
-- ──────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('room-originals', 'room-originals', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('room-results', 'room-results', false)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────
-- Storage Policies — room-originals
-- Paths are prefixed with the user's ID: "<user-id>/<filename>"
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "select_own_originals" ON storage.objects;
CREATE POLICY "select_own_originals" ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'room-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "insert_own_originals" ON storage.objects;
CREATE POLICY "insert_own_originals" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'room-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "update_own_originals" ON storage.objects;
CREATE POLICY "update_own_originals" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'room-originals' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'room-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "delete_own_originals" ON storage.objects;
CREATE POLICY "delete_own_originals" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'room-originals' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ──────────────────────────────────────────────
-- Storage Policies — room-results
-- Paths are prefixed with the user's ID: "<user-id>/<filename>"
-- ──────────────────────────────────────────────

DROP POLICY IF EXISTS "select_own_results" ON storage.objects;
CREATE POLICY "select_own_results" ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'room-results' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "insert_own_results" ON storage.objects;
CREATE POLICY "insert_own_results" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'room-results' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "update_own_results" ON storage.objects;
CREATE POLICY "update_own_results" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'room-results' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'room-results' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "delete_own_results" ON storage.objects;
CREATE POLICY "delete_own_results" ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'room-results' AND auth.uid()::text = (storage.foldername(name))[1]);
