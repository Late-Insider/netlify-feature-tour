-- Create subscribers table for all subscription types
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  unsubscribe_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(email, category)
);

-- Create creator applications table
CREATE TABLE IF NOT EXISTS creator_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  portfolio VARCHAR(500),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_category ON subscribers(category);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_unsubscribe_token ON subscribers(unsubscribe_token);
