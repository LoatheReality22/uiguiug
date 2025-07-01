/*
  # Initial Schema for Hyam Movement Portal

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `phone` (text)
      - `role` (text, default 'client')
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `cases`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `client_id` (uuid, references profiles)
      - `status` (text, default 'pending')
      - `priority` (text, default 'medium')
      - `case_type` (text)
      - `due_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin users can access all data
    - Clients can only access their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  status text DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'review', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  case_type text NOT NULL,
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cases policies
CREATE POLICY "Users can read own cases"
  ON cases
  FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all cases"
  ON cases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert admin user (Harley)
INSERT INTO profiles (id, email, full_name, role, status)
VALUES (
  gen_random_uuid(),
  'harley@hyammovement.com',
  'Harley - Admin',
  'admin',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data
INSERT INTO profiles (id, email, full_name, phone, role, status, created_at) VALUES
  (gen_random_uuid(), 'sarah.johnson@email.com', 'Sarah Johnson', '+1 (555) 123-4567', 'client', 'active', '2024-01-15'),
  (gen_random_uuid(), 'michael.chen@email.com', 'Michael Chen', '+1 (555) 234-5678', 'client', 'active', '2024-02-03'),
  (gen_random_uuid(), 'emily.rodriguez@email.com', 'Emily Rodriguez', '+1 (555) 345-6789', 'client', 'pending', '2024-02-20'),
  (gen_random_uuid(), 'david.thompson@email.com', 'David Thompson', '+1 (555) 456-7890', 'client', 'active', '2023-11-10')
ON CONFLICT (email) DO NOTHING;

-- Insert sample cases
INSERT INTO cases (title, description, client_id, status, priority, case_type, due_date, created_at) VALUES
  (
    'Immigration Status Review',
    'Comprehensive review of immigration status and pathway to permanent residency',
    (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'),
    'in-progress',
    'high',
    'Immigration',
    '2024-03-15',
    '2024-01-20'
  ),
  (
    'Family Reunification Case',
    'Assistance with family reunification process and documentation',
    (SELECT id FROM profiles WHERE email = 'sarah.johnson@email.com'),
    'pending',
    'high',
    'Family Law',
    '2024-04-01',
    '2024-02-01'
  ),
  (
    'Work Permit Application',
    'Application for work permit and employment authorization',
    (SELECT id FROM profiles WHERE email = 'michael.chen@email.com'),
    'in-progress',
    'medium',
    'Employment',
    '2024-03-20',
    '2024-02-05'
  ),
  (
    'Citizenship Application',
    'Preparation and submission of citizenship application',
    (SELECT id FROM profiles WHERE email = 'emily.rodriguez@email.com'),
    'review',
    'low',
    'Citizenship',
    '2024-05-01',
    '2024-02-22'
  ),
  (
    'Deportation Defense',
    'Legal defense against deportation proceedings - Successfully resolved',
    (SELECT id FROM profiles WHERE email = 'david.thompson@email.com'),
    'completed',
    'high',
    'Defense',
    '2024-01-30',
    '2023-11-15'
  );