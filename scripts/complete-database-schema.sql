-- Drop existing tables if they exist
DROP TABLE IF EXISTS email_queue CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS creator_applications CASCADE;
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS analytics_page_views CASCADE;

-- Create subscribers table
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, category)
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create creator_applications table
CREATE TABLE creator_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  portfolio_url VARCHAR(500),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  article_slug VARCHAR(255) NOT NULL,
  article_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_queue table
CREATE TABLE email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  email_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_page_views table
CREATE TABLE analytics_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  referrer VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_data JSONB,
  page_path VARCHAR(500),
  user_agent TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_category ON subscribers(category);
CREATE INDEX idx_subscribers_is_active ON subscribers(is_active);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_creator_applications_email ON creator_applications(email);
CREATE INDEX idx_creator_applications_status ON creator_applications(status);
CREATE INDEX idx_comments_article_slug ON comments(article_slug);
CREATE INDEX idx_comments_article_type ON comments(article_type);
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);
CREATE INDEX idx_analytics_page_views_page_path ON analytics_page_views(page_path);
CREATE INDEX idx_analytics_page_views_created_at ON analytics_page_views(created_at);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public inserts
CREATE POLICY "Allow public inserts" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads" ON subscribers FOR SELECT USING (true);

CREATE POLICY "Allow public inserts" ON contact_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts" ON creator_applications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads" ON comments FOR SELECT USING (true);

CREATE POLICY "Allow public inserts" ON email_queue FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts" ON analytics_page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public inserts" ON analytics_events FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for email_queue updated_at
CREATE TRIGGER update_email_queue_updated_at BEFORE UPDATE ON email_queue
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
