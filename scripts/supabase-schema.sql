-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, category)
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creator_applications table
CREATE TABLE IF NOT EXISTS creator_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  portfolio_url VARCHAR(500),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_category ON subscribers(category);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_creator_applications_email ON creator_applications(email);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public inserts
CREATE POLICY "Allow public inserts" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts" ON creator_applications FOR INSERT WITH CHECK (true);
