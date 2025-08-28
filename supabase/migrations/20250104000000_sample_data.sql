/*
  # Sample Data Migration

  This migration adds sample data for testing:
  1. Sample users (after auth.users is created)
  2. Sample blog posts
  3. Sample automation requests
*/

-- Insert sample users (run this after creating auth.users)
-- Note: These will be created automatically when users sign up via the handle_new_user() trigger

-- Insert sample blog posts (run this after users are created)
INSERT INTO blog_posts (title, content, excerpt, author_id, author_name, category, tags, status, read_time, meta_title, meta_description) VALUES
(
  'Getting Started with Automation',
  '<h1>Getting Started with Automation</h1><p>Automation is the key to improving productivity and efficiency in modern workflows. This comprehensive guide will walk you through the basics of workflow automation and help you get started with your first automated process.</p><h2>What is Automation?</h2><p>Automation refers to the use of technology to perform tasks without human intervention. In the context of workflows, automation can help streamline repetitive processes, reduce errors, and increase efficiency.</p><h2>Benefits of Automation</h2><ul><li>Increased productivity</li><li>Reduced errors</li><li>Cost savings</li><li>Better scalability</li><li>Improved consistency</li></ul>',
  'Learn the basics of workflow automation and how to get started with your first automated process.',
  (SELECT id FROM auth.users LIMIT 1),
  'Admin User',
  'Otomasyon',
  ARRAY['automation', 'workflow', 'productivity'],
  'published',
  8,
  'Getting Started with Automation - Complete Guide',
  'Learn the basics of workflow automation and how to get started with your first automated process. Discover tools, best practices, and real-world examples.'
),
(
  'Advanced API Integration Techniques',
  '<h1>Advanced API Integration Techniques</h1><p>Master the art of connecting different services and applications through APIs. This advanced guide covers authentication methods, error handling, rate limiting, and best practices for building robust integrations.</p><h2>API Authentication</h2><p>Proper authentication is crucial for secure API integrations. Common methods include API keys, OAuth 2.0, and JWT tokens.</p><h2>Error Handling</h2><p>Implementing proper error handling ensures your integrations remain reliable even when external services are unavailable.</p>',
  'Explore advanced techniques for integrating APIs and building robust connections between services.',
  (SELECT id FROM auth.users LIMIT 1),
  'Admin User',
  'API Entegrasyonu',
  ARRAY['api', 'integration', 'webhooks'],
  'published',
  12,
  'Advanced API Integration Techniques - Expert Guide',
  'Explore advanced techniques for integrating APIs and building robust connections between services. Learn about authentication, error handling, and best practices.'
),
(
  'Webhook Best Practices',
  '<h1>Webhook Best Practices</h1><p>Webhooks are a powerful way to receive real-time updates from external services. This guide covers webhook security, retry mechanisms, and monitoring strategies.</p><h2>Webhook Security</h2><p>Always verify webhook signatures and use HTTPS endpoints to ensure secure communication.</p><h2>Retry Logic</h2><p>Implement exponential backoff for failed webhook deliveries to handle temporary outages gracefully.</p>',
  'Learn best practices for implementing and managing webhooks in your applications.',
  (SELECT id FROM auth.users LIMIT 1),
  'Admin User',
  'Webhook',
  ARRAY['webhook', 'security', 'integration'],
  'published',
  10,
  'Webhook Best Practices - Security and Reliability',
  'Learn best practices for implementing and managing webhooks in your applications. Cover security, retry logic, and monitoring.'
);

-- Insert sample automation requests (run this after users are created)
INSERT INTO automation_requests (user_id, automation_name, automation_description, webhook_payload, status) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'Gmail to Slack Notification',
  'Automatically send Slack notifications when new emails arrive in Gmail',
  '{"trigger": "Gmail New Email", "actions": ["Send Slack Message"], "platform": "n8n"}',
  'completed'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Twitter to Discord Webhook',
  'Forward Twitter mentions to Discord channel',
  '{"trigger": "Twitter Mention", "actions": ["Send Discord Message"], "platform": "n8n"}',
  'pending'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Database Backup Automation',
  'Automated daily database backup to cloud storage',
  '{"trigger": "Daily Schedule", "actions": ["Database Backup", "Upload to Cloud"], "platform": "n8n"}',
  'sent'
);
