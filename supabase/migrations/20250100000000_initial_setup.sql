/*
  # Initial Setup Migration

  This migration creates:
  1. update_updated_at_column() function (required by other migrations)
  2. Basic utility functions
*/

-- Create update_updated_at_column function (required by other migrations)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create utility function for generating UUIDs
CREATE OR REPLACE FUNCTION gen_random_uuid()
RETURNS uuid AS $$
BEGIN
    RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
