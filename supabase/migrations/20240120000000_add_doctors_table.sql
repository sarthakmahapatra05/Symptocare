-- Add doctors table with detailed information
CREATE TABLE IF NOT EXISTS doctors (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  license_number TEXT UNIQUE NOT NULL,
  specialization TEXT NOT NULL,
  experience_years INTEGER,
  qualifications TEXT[],
  languages TEXT[],
  consultation_fee DECIMAL(10, 2),
  location TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  bio TEXT,
  availability JSONB, -- Store availability schedule
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update doctor_applications to link to doctors table
ALTER TABLE doctor_applications 
ADD COLUMN IF NOT EXISTS doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE;

-- Add more fields to appointments
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS consultation_type TEXT CHECK (consultation_type IN ('in-person', 'video', 'phone')) DEFAULT 'in-person',
ADD COLUMN IF NOT EXISTS reason TEXT,
ADD COLUMN IF NOT EXISTS patient_notes TEXT;

-- Enable RLS on doctors table
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors
-- Doctors can view their own profile
CREATE POLICY "Doctors can view own profile" ON doctors FOR SELECT 
USING (auth.uid() = id);

-- Doctors can update their own profile (only if verified)
CREATE POLICY "Doctors can update own profile" ON doctors FOR UPDATE 
USING (auth.uid() = id AND is_verified = true);

-- Public can view verified doctors
CREATE POLICY "Public can view verified doctors" ON doctors FOR SELECT 
USING (is_verified = true);

-- Admins can view all doctors
CREATE POLICY "Admins can view all doctors" ON doctors FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins can update doctor verification status
CREATE POLICY "Admins can update doctor verification" ON doctors FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Update appointments RLS to allow doctors to see their appointments
DROP POLICY IF EXISTS "Users can manage their appointments" ON appointments;
CREATE POLICY "Patients can manage their appointments" ON appointments FOR ALL 
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their appointments" ON appointments FOR SELECT 
USING (
  auth.uid() = doctor_id AND
  EXISTS (
    SELECT 1 FROM doctors 
    WHERE id = doctor_id AND is_verified = true
  )
);

CREATE POLICY "Doctors can update their appointments" ON appointments FOR UPDATE 
USING (
  auth.uid() = doctor_id AND
  EXISTS (
    SELECT 1 FROM doctors 
    WHERE id = doctor_id AND is_verified = true
  )
);

-- Trigger to update updated_at
CREATE TRIGGER update_doctors_updated_at 
BEFORE UPDATE ON doctors 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_doctors_verified ON doctors(is_verified);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

