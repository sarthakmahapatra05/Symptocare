-- Add profile fields used by onboarding/profile UI.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 0 AND age <= 130);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS occupation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_medications TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergies TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_doctor TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consultation_preference TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS health_goals TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS symptom_tracking TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reminder_frequency TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Backfill common profile values from auth metadata when available.
UPDATE profiles p
SET
  full_name = COALESCE(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  phone = COALESCE(p.phone, u.raw_user_meta_data->>'phone')
FROM auth.users u
WHERE u.id = p.id;

-- Keep public.profiles synced for new and updated auth users.
CREATE OR REPLACE FUNCTION public.sync_profile_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = TIMEZONE('utc'::text, NOW());

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_auth();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE OF email, raw_user_meta_data ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_from_auth();

-- Doctor signup inserts a doctor row; allow users to insert their own doctor profile.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'doctors'
      AND policyname = 'Doctors can create own profile'
  ) THEN
    CREATE POLICY "Doctors can create own profile"
      ON doctors
      FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

