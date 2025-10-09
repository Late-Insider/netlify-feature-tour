-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'reaction', 'comment', 'share', 'read_time')),
  article_slug TEXT NOT NULL,
  article_type TEXT NOT NULL CHECK (article_type IN ('blog', 'newsletter')),
  visitor_id TEXT NOT NULL,
  reaction_type TEXT,
  read_time_seconds INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_article_slug ON analytics_events(article_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor_id ON analytics_events(visitor_id);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  article_type TEXT NOT NULL CHECK (article_type IN ('blog', 'newsletter')),
  commenter_name TEXT NOT NULL,
  commenter_email TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_article_slug ON comments(article_slug);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Scheduled Emails Table
CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  email_type TEXT NOT NULL CHECK (email_type IN ('welcome', 'newsletter', 'notification', 'custom')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_sent ON scheduled_emails(sent);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_scheduled_for ON scheduled_emails(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_email_type ON scheduled_emails(email_type);

-- Email Statistics View
CREATE OR REPLACE VIEW email_statistics AS
SELECT 
  email_type,
  COUNT(*) as total,
  SUM(CASE WHEN sent THEN 1 ELSE 0 END) as sent_count,
  SUM(CASE WHEN NOT sent THEN 1 ELSE 0 END) as pending_count,
  ROUND(AVG(CASE WHEN sent THEN EXTRACT(EPOCH FROM (sent_at - created_at)) ELSE NULL END)) as avg_send_time_seconds
FROM scheduled_emails
GROUP BY email_type;

-- Article Analytics View
CREATE OR REPLACE VIEW article_analytics AS
SELECT 
  article_slug,
  article_type,
  COUNT(CASE WHEN event_type = 'view' THEN 1 END) as views,
  COUNT(CASE WHEN event_type = 'reaction' THEN 1 END) as reactions,
  COUNT(CASE WHEN event_type = 'comment' THEN 1 END) as comments,
  COUNT(CASE WHEN event_type = 'share' THEN 1 END) as shares,
  ROUND(AVG(CASE WHEN event_type = 'read_time' THEN read_time_seconds END)) as avg_read_time,
  ROUND(
    (COUNT(CASE WHEN event_type IN ('reaction', 'comment', 'share') THEN 1 END)::NUMERIC / 
     NULLIF(COUNT(CASE WHEN event_type = 'view' THEN 1 END), 0) * 100), 2
  ) as engagement_rate
FROM analytics_events
GROUP BY article_slug, article_type;
