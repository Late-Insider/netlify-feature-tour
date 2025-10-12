-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR LATE WEBSITE
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUBSCRIBERS
-- =====================================================

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  source VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  email_count INTEGER DEFAULT 0,
  UNIQUE(email, source)
);

CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_source ON subscribers(source);
CREATE INDEX idx_subscribers_active ON subscribers(is_active);

-- =====================================================
-- BLOG POSTS
-- =====================================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  category VARCHAR(100),
  tags TEXT[],
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  read_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(is_published);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);

-- =====================================================
-- NEWSLETTER ARTICLES
-- =====================================================

CREATE TABLE IF NOT EXISTS newsletter_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  issue_number INTEGER,
  featured_image TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  read_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_newsletter_slug ON newsletter_articles(slug);
CREATE INDEX idx_newsletter_published ON newsletter_articles(is_published);
CREATE INDEX idx_newsletter_published_at ON newsletter_articles(published_at DESC);

-- =====================================================
-- PRODUCTS
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  category VARCHAR(100),
  images TEXT[],
  is_available BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);

-- =====================================================
-- COMMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  comment TEXT NOT NULL,
  article_slug VARCHAR(255) NOT NULL,
  article_type VARCHAR(50) NOT NULL,
  parent_id UUID REFERENCES comments(id),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_article ON comments(article_slug, article_type);
CREATE INDEX idx_comments_email ON comments(email);
CREATE INDEX idx_comments_approved ON comments(is_approved);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- =====================================================
-- REACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  article_slug VARCHAR(255) NOT NULL,
  article_type VARCHAR(50) NOT NULL,
  reaction_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, article_slug, article_type, reaction_type)
);

CREATE INDEX idx_reactions_article ON reactions(article_slug, article_type);
CREATE INDEX idx_reactions_type ON reactions(reaction_type);

-- =====================================================
-- EMAIL QUEUE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject VARCHAR(500) NOT NULL,
  html_content TEXT NOT NULL,
  email_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_scheduled ON email_queue(scheduled_for);
CREATE INDEX idx_email_queue_created ON email_queue(created_at DESC);

-- =====================================================
-- ANALYTICS
-- =====================================================

CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(45),
  country VARCHAR(2),
  device_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_category VARCHAR(100),
  event_label VARCHAR(255),
  event_value INTEGER,
  page_path VARCHAR(500),
  user_id UUID REFERENCES users(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_name ON events(event_name);
CREATE INDEX idx_events_category ON events(event_category);
CREATE INDEX idx_events_created ON events(created_at DESC);

-- =====================================================
-- CONTACT SUBMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  replied_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_submitted ON contact_submissions(submitted_at DESC);

-- =====================================================
-- CREATOR APPLICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS creator_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  portfolio_url TEXT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creator_email ON creator_applications(email);
CREATE INDEX idx_creator_status ON creator_applications(status);
CREATE INDEX idx_creator_submitted ON creator_applications(submitted_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_applications ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published newsletters" ON newsletter_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view available products" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view approved comments" ON comments
  FOR SELECT USING (is_approved = true);

-- Public insert access for user interactions
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can add reactions" ON reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can apply as creator" ON creator_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can track page views" ON page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can track events" ON events
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_updated_at BEFORE UPDATE ON newsletter_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_queue_updated_at BEFORE UPDATE ON email_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(
  p_slug VARCHAR,
  p_type VARCHAR
)
RETURNS void AS $$
BEGIN
  IF p_type = 'post' THEN
    UPDATE posts SET view_count = view_count + 1 WHERE slug = p_slug;
  ELSIF p_type = 'newsletter' THEN
    UPDATE newsletter_articles SET view_count = view_count + 1 WHERE slug = p_slug;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert admin user
INSERT INTO users (email, name, role) VALUES
  ('admin@late.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
