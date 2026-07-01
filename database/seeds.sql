-- Digimium Store — Seed Data
-- Run after schema.sql to populate the full product catalog.
-- Safe to re-run (upserts on products/plans/durations; replaces feature groups).
--
-- Usage:
--   mysql -u root -p digimium < database/seeds.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Products ─────────────────────────────────────────────────────────────────

INSERT INTO products (id, name, category, summary, description, status, status_note, tone, promoted, promotion_label, promotion_note, sort_order) VALUES
('chatgpt-plus',        'ChatGPT Plus',         'AI Tools',     'Everyday AI for writing, research, and coding.',          'A flexible AI subscription for faster answers, stronger models, and productive daily workflows.',           'available',    '',                                                                                    'blue',   1, 'This week only', 'Save on longer plans while the offer is active.', 1),
('claude-pro',          'Claude Pro',            'AI Tools',     'Long-form thinking for documents and analysis.',          'A thoughtful AI plan designed for deeper documents, analysis, planning, and long conversations.',            'available',    '', 'orange', 0, '', '', 2),
('perplexity-pro',      'Perplexity Pro',        'AI Tools',     'Fast, source-backed answers for research.',               'A focused research companion for exploring topics quickly with citations and advanced search tools.',          'available',    '', 'green',  0, '', '', 3),
('gemini-advanced',     'Gemini Advanced',       'AI Tools',     'Google AI for writing, planning, and everyday help.',     'Advanced Gemini access for research, writing, image help, and Google-powered productivity.',                  'available',    '', 'blue',   0, '', '', 4),
('manus-pro',           'Manus Pro',             'AI Tools',     'Agentic AI help for tasks and workflows.',                'A capable AI workspace for planning, executing, and organizing more complex digital work.',                   'available',    '', 'violet', 0, '', '', 5),
('grok-premium',        'Grok Premium',          'AI Tools',     'Conversational AI for fast answers and ideas.',           'Grok access for quick research, brainstorming, writing support, and conversational assistance.',              'out-of-stock', 'Temporarily unavailable. It will stay visible here and return when stock is ready.', 'green',  0, '', '', 6),
('suno-pro',            'Suno Pro',              'Creative',     'AI music creation for songs and ideas.',                  'Create music concepts, demos, and song ideas with AI-powered generation tools.',                            'available',    '', 'orange', 0, '', '', 7),
('netflix',             'Netflix',               'Streaming',    'Movies and series ready when you are.',                   'Straightforward streaming access for series, films, documentaries, and family entertainment.',                'available',    '', 'orange', 0, '', '', 8),
('spotify-premium',     'Spotify Premium',       'Streaming',    'Ad-free music, playlists, and downloads.',                'Premium listening for music and podcasts with downloads and uninterrupted playback.',                         'available',    '', 'green',  0, '', '', 9),
('expressvpn',          'ExpressVPN',            'VPN',          'Fast protection with a simple interface.',                'A polished VPN choice for fast, stable, and private internet connections.',                                  'available',    '', 'violet', 0, '', '', 10),
('hiddify-vpn',         'Hiddify VPN',           'VPN',          'Simple VPN access for private browsing.',                 'A lightweight VPN option for safer everyday browsing and simple protected connections.',                     'available',    '', 'green',  0, '', '', 11),
('canva-pro',           'Canva Pro',             'Creative',     'Fast design tools for everyday content.',                 'Create social posts, presentations, videos, and brand assets with expanded design tools.',                   'available',    '', 'violet', 0, '', '', 12),
('adobe-creative-cloud','Adobe Creative Cloud',  'Creative',     'Professional tools for serious creative work.',           'A full creative toolkit for design, photography, illustration, video, and production workflows.',             'dm-for-price', 'Price depends on plan availability. DM admin for the current option.',             'blue',   0, '', '', 13),
('capcut-pro',          'CapCut Pro',            'Creative',     'Quick video editing for social content.',                 'Easy, capable video editing with premium effects and tools for short-form content.',                         'available',    '', 'violet', 0, '', '', 14),
('microsoft-365',       'Microsoft 365',         'Productivity', 'Office apps and cloud tools for daily work.',             'Productivity access for Word, Excel, PowerPoint, cloud storage, and everyday document work.',                'available',    '', 'blue',   0, '', '', 15),
('notion-plus',         'Notion Plus',           'Productivity', 'A clean workspace for notes, docs, and projects.',        'Notion access for organized notes, team spaces, project pages, and flexible planning.',                      'available',    '', 'orange', 0, '', '', 16),
('zoom-pro',            'Zoom Pro',              'Productivity', 'Meetings and video calls without limits.',                'Zoom access for longer calls, online classes, team meetings, and client sessions.',                          'available',    '', 'blue',   0, '', '', 17),
('duolingo-super',      'Duolingo Super',        'Learning',     'Language practice with fewer interruptions.',             'A learning subscription for language practice, extra features, and smoother daily lessons.',                 'available',    '', 'green',  0, '', '', 18)
ON DUPLICATE KEY UPDATE
  name = VALUES(name), category = VALUES(category), summary = VALUES(summary),
  description = VALUES(description), status = VALUES(status), status_note = VALUES(status_note),
  tone = VALUES(tone), promoted = VALUES(promoted), promotion_label = VALUES(promotion_label),
  promotion_note = VALUES(promotion_note), sort_order = VALUES(sort_order);

-- ─── Plans ────────────────────────────────────────────────────────────────────

-- chatgpt-plus: 3 explicit plans
INSERT INTO product_plans (id, product_id, name, description, status, sort_order) VALUES
('chatgpt-plus-shared',   'chatgpt-plus', 'Shared',        'Budget-friendly access for everyday AI use.',       'available', 1),
('chatgpt-plus-private',  'chatgpt-plus', 'Private',       'A private account option with dedicated access.',   'available', 2),
('chatgpt-plus-own-mail', 'chatgpt-plus', 'Your own mail', 'ChatGPT Plus activated using your own email.',      'available', 3)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), status = VALUES(status), sort_order = VALUES(sort_order);

-- All other products: single standard plan
INSERT INTO product_plans (id, product_id, name, description, status, sort_order) VALUES
('claude-pro-standard',           'claude-pro',           'Standard', '', 'available',    1),
('perplexity-pro-standard',       'perplexity-pro',       'Standard', '', 'available',    1),
('gemini-advanced-standard',      'gemini-advanced',      'Standard', '', 'available',    1),
('manus-pro-standard',            'manus-pro',            'Standard', '', 'available',    1),
('grok-premium-standard',         'grok-premium',         'Standard', '', 'out-of-stock', 1),
('suno-pro-standard',             'suno-pro',             'Standard', '', 'available',    1),
('netflix-standard',              'netflix',              'Standard', '', 'available',    1),
('spotify-premium-standard',      'spotify-premium',      'Standard', '', 'available',    1),
('expressvpn-standard',           'expressvpn',           'Standard', '', 'available',    1),
('hiddify-vpn-standard',          'hiddify-vpn',          'Standard', '', 'available',    1),
('canva-pro-standard',            'canva-pro',            'Standard', '', 'available',    1),
('adobe-creative-cloud-standard', 'adobe-creative-cloud', 'Standard', '', 'dm-for-price', 1),
('capcut-pro-standard',           'capcut-pro',           'Standard', '', 'available',    1),
('microsoft-365-standard',        'microsoft-365',        'Standard', '', 'available',    1),
('notion-plus-standard',          'notion-plus',          'Standard', '', 'available',    1),
('zoom-pro-standard',             'zoom-pro',             'Standard', '', 'available',    1),
('duolingo-super-standard',       'duolingo-super',       'Standard', '', 'available',    1)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), status = VALUES(status), sort_order = VALUES(sort_order);

-- ─── Durations ────────────────────────────────────────────────────────────────

INSERT INTO product_plan_durations (plan_id, label, price, original_price, status, sort_order) VALUES
-- chatgpt-plus shared
('chatgpt-plus-shared',   '1 month',  15000,  NULL,   'available', 1),
('chatgpt-plus-shared',   '3 months', 42000,  45000,  'available', 2),
('chatgpt-plus-shared',   '1 year',   150000, 180000, 'available', 3),
-- chatgpt-plus private
('chatgpt-plus-private',  '1 month',  49000,  NULL,   'available', 1),
('chatgpt-plus-private',  '3 months', 140000, 147000, 'available', 2),
-- chatgpt-plus own mail
('chatgpt-plus-own-mail', '1 month',  135000, NULL,   'available', 1),
-- claude-pro
('claude-pro-standard',           '1 month',  16000,  NULL,   'available', 1),
('claude-pro-standard',           '3 months', 45000,  48000,  'available', 2),
('claude-pro-standard',           '1 year',   168000, 192000, 'available', 3),
-- perplexity-pro
('perplexity-pro-standard',       '1 month',  14000,  NULL,   'available', 1),
('perplexity-pro-standard',       '3 months', 39000,  42000,  'available', 2),
('perplexity-pro-standard',       '1 year',   145000, 168000, 'available', 3),
-- gemini-advanced
('gemini-advanced-standard',      '1 month',  15000,  NULL,   'available', 1),
('gemini-advanced-standard',      '3 months', 42000,  45000,  'available', 2),
('gemini-advanced-standard',      '1 year',   150000, 180000, 'available', 3),
-- manus-pro
('manus-pro-standard',            '1 month',  18000,  NULL,   'available', 1),
('manus-pro-standard',            '3 months', 51000,  54000,  'available', 2),
('manus-pro-standard',            '1 year',   192000, 216000, 'available', 3),
-- grok-premium
('grok-premium-standard',         '1 month',  12000,  NULL,   'available', 1),
('grok-premium-standard',         '3 months', 34000,  36000,  'available', 2),
('grok-premium-standard',         '1 year',   132000, 144000, 'available', 3),
-- suno-pro
('suno-pro-standard',             '1 month',  13000,  NULL,   'available', 1),
('suno-pro-standard',             '3 months', 37000,  39000,  'available', 2),
('suno-pro-standard',             '1 year',   144000, 156000, 'available', 3),
-- netflix
('netflix-standard',              '1 month',  10000,  NULL,   'available', 1),
('netflix-standard',              '3 months', 30000,  NULL,   'available', 2),
('netflix-standard',              '1 year',   110000, 120000, 'available', 3),
-- spotify-premium
('spotify-premium-standard',      '1 month',  7000,   NULL,   'available', 1),
('spotify-premium-standard',      '3 months', 20000,  21000,  'available', 2),
('spotify-premium-standard',      '1 year',   76000,  84000,  'available', 3),
-- expressvpn
('expressvpn-standard',           '1 month',  9500,   NULL,   'available', 1),
('expressvpn-standard',           '3 months', 27000,  28500,  'available', 2),
('expressvpn-standard',           '1 year',   96000,  114000, 'available', 3),
-- hiddify-vpn
('hiddify-vpn-standard',          '1 month',  6000,   NULL,   'available', 1),
('hiddify-vpn-standard',          '3 months', 17000,  18000,  'available', 2),
('hiddify-vpn-standard',          '1 year',   65000,  72000,  'available', 3),
-- canva-pro
('canva-pro-standard',            '1 month',  8000,   NULL,   'available', 1),
('canva-pro-standard',            '3 months', 23000,  24000,  'available', 2),
('canva-pro-standard',            '1 year',   82000,  96000,  'available', 3),
-- adobe-creative-cloud
('adobe-creative-cloud-standard', '1 month',  18000,  NULL,   'available', 1),
('adobe-creative-cloud-standard', '3 months', 52000,  54000,  'available', 2),
('adobe-creative-cloud-standard', '1 year',   198000, 216000, 'available', 3),
-- capcut-pro
('capcut-pro-standard',           '1 month',  7500,   NULL,   'available', 1),
('capcut-pro-standard',           '3 months', 21000,  22500,  'available', 2),
('capcut-pro-standard',           '1 year',   78000,  90000,  'available', 3),
-- microsoft-365
('microsoft-365-standard',        '1 month',  10000,  NULL,   'available', 1),
('microsoft-365-standard',        '3 months', 28000,  30000,  'available', 2),
('microsoft-365-standard',        '1 year',   105000, 120000, 'available', 3),
-- notion-plus
('notion-plus-standard',          '1 month',  9000,   NULL,   'available', 1),
('notion-plus-standard',          '3 months', 26000,  27000,  'available', 2),
('notion-plus-standard',          '1 year',   98000,  108000, 'available', 3),
-- zoom-pro
('zoom-pro-standard',             '1 month',  12000,  NULL,   'available', 1),
('zoom-pro-standard',             '3 months', 34000,  36000,  'available', 2),
('zoom-pro-standard',             '1 year',   132000, 144000, 'available', 3),
-- duolingo-super
('duolingo-super-standard',       '1 month',  8000,   NULL,   'available', 1),
('duolingo-super-standard',       '3 months', 23000,  24000,  'available', 2),
('duolingo-super-standard',       '1 year',   88000,  96000,  'available', 3)
ON DUPLICATE KEY UPDATE
  price = VALUES(price), original_price = VALUES(original_price),
  status = VALUES(status), sort_order = VALUES(sort_order);

-- ─── Feature Groups & Features ────────────────────────────────────────────────
-- Delete + re-insert to handle auto-increment IDs cleanly.

DELETE FROM product_feature_groups WHERE product_id IN (
  'chatgpt-plus','claude-pro','perplexity-pro','gemini-advanced','manus-pro',
  'grok-premium','suno-pro','netflix','spotify-premium','expressvpn',
  'hiddify-vpn','canva-pro','adobe-creative-cloud','capcut-pro',
  'microsoft-365','notion-plus','zoom-pro','duolingo-super'
);

-- chatgpt-plus
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('chatgpt-plus', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Advanced AI models',1),(@fg,'Writing and coding help',2),(@fg,'Image and file tools',3),(@fg,'Faster availability',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('chatgpt-plus', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- claude-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('claude-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Long context conversations',1),(@fg,'Document analysis',2),(@fg,'Writing assistance',3),(@fg,'Priority access',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('claude-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- perplexity-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('perplexity-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Source-backed search',1),(@fg,'Advanced research modes',2),(@fg,'File analysis',3),(@fg,'Higher usage limits',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('perplexity-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- gemini-advanced
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('gemini-advanced', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Advanced Gemini models',1),(@fg,'Writing and planning help',2),(@fg,'Image and file assistance',3),(@fg,'Google ecosystem support',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('gemini-advanced', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- manus-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('manus-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Task-focused AI support',1),(@fg,'Workflow assistance',2),(@fg,'Research and planning',3),(@fg,'Productivity tools',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('manus-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- grok-premium
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('grok-premium', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'AI chat access',1),(@fg,'Writing and idea support',2),(@fg,'Research assistance',3),(@fg,'Fast everyday answers',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('grok-premium', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- suno-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('suno-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'AI song generation',1),(@fg,'Creative music drafts',2),(@fg,'Prompt-based creation',3),(@fg,'Expanded usage limits',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('suno-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- netflix
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('netflix', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Movies and series',1),(@fg,'Multiple genres',2),(@fg,'Smart recommendations',3),(@fg,'Cross-device viewing',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('netflix', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- spotify-premium
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('spotify-premium', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Ad-free listening',1),(@fg,'Offline downloads',2),(@fg,'On-demand playback',3),(@fg,'High-quality audio',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('spotify-premium', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- expressvpn
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('expressvpn', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Fast global servers',1),(@fg,'Strong encryption',2),(@fg,'Easy device apps',3),(@fg,'Reliable connectivity',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('expressvpn', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- hiddify-vpn
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('hiddify-vpn', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Private browsing',1),(@fg,'Simple device setup',2),(@fg,'Encrypted connection',3),(@fg,'Everyday VPN access',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('hiddify-vpn', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- canva-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('canva-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Premium templates',1),(@fg,'Brand tools',2),(@fg,'Background removal',3),(@fg,'Expanded media library',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('canva-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- adobe-creative-cloud
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('adobe-creative-cloud', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Creative desktop apps',1),(@fg,'Cloud workflow',2),(@fg,'Design and photo tools',3),(@fg,'Video production tools',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('adobe-creative-cloud', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- capcut-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('capcut-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Premium effects',1),(@fg,'Advanced editing tools',2),(@fg,'Cloud storage',3),(@fg,'Social-ready exports',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('capcut-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- microsoft-365
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('microsoft-365', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Office apps',1),(@fg,'Cloud storage',2),(@fg,'Document editing',3),(@fg,'Cross-device workflow',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('microsoft-365', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- notion-plus
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('notion-plus', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Unlimited blocks',1),(@fg,'Organized workspaces',2),(@fg,'Project pages',3),(@fg,'Team-ready notes',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('notion-plus', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- zoom-pro
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('zoom-pro', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Longer meetings',1),(@fg,'Video conferencing',2),(@fg,'Screen sharing',3),(@fg,'Reliable meeting access',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('zoom-pro', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

-- duolingo-super
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('duolingo-super', 'What you get', 1);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Language lessons',1),(@fg,'Ad-free practice',2),(@fg,'Extra learning tools',3),(@fg,'Daily study support',4);
INSERT INTO product_feature_groups (product_id, title, sort_order) VALUES ('duolingo-super', 'Digimium service', 2);
SET @fg = LAST_INSERT_ID();
INSERT INTO product_features (group_id, item, sort_order) VALUES (@fg,'Telegram order support',1),(@fg,'Clear price before confirmation',2),(@fg,'Simple digital delivery',3);

SET FOREIGN_KEY_CHECKS = 1;
