INSERT INTO contacts (id, type, title, subtitle, url, status, sort_order)
VALUES
  ('facebook-digimium', 'facebook', 'digimium.', 'Facebook page', 'https://www.facebook.com/profile.php?id=61586643983894&locale=th_TH', 'available', 1),
  ('facebook-digimium-2', 'facebook', 'digimium. 2.0', 'Backup Facebook page', 'https://www.facebook.com/profile.php?id=61561290184783&locale=th_TH', 'available', 2),
  ('telegram-channel', 'telegram-channel', 'Telegram channel', '@buyheredigimium', 'https://t.me/buyheredigimium', 'available', 3),
  ('telegram-admin', 'telegram-admin', 'Telegram admin', '@LynnIsHeree', 'https://t.me/LynnIsHeree', 'available', 4)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  subtitle = VALUES(subtitle),
  url = VALUES(url),
  status = VALUES(status),
  sort_order = VALUES(sort_order);

INSERT INTO products (id, name, category, summary, description, status, status_note, tone, logo_background, promoted, promotion_label, promotion_note, sort_order)
VALUES
  ('chatgpt-plus', 'ChatGPT Plus', 'AI Tools', 'Everyday AI for writing, research, and coding.', 'A flexible AI subscription for faster answers, stronger models, and productive daily workflows.', 'available', '', 'blue', '#ddecff', 1, 'This week only', 'Save on longer plans while the offer is active.', 1),
  ('grok-premium', 'Grok Premium', 'AI Tools', 'Conversational AI for fast answers and ideas.', 'Grok access for quick research, brainstorming, writing support, and conversational assistance.', 'out-of-stock', 'Temporarily unavailable. It will stay visible here and return when stock is ready.', 'green', '#daf7df', 0, '', '', 2),
  ('adobe-creative-cloud', 'Adobe Creative Cloud', 'Creative', 'Professional tools for serious creative work.', 'A full creative toolkit for design, photography, illustration, video, and production workflows.', 'dm-for-price', 'Price depends on plan availability. DM admin for the current option.', 'blue', '#eef4ff', 0, '', '', 3)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  summary = VALUES(summary),
  description = VALUES(description),
  status = VALUES(status),
  status_note = VALUES(status_note),
  tone = VALUES(tone),
  logo_background = VALUES(logo_background),
  promoted = VALUES(promoted),
  promotion_label = VALUES(promotion_label),
  promotion_note = VALUES(promotion_note),
  sort_order = VALUES(sort_order);

INSERT INTO product_plans (id, product_id, name, description, status, sort_order)
VALUES
  ('chatgpt-plus-shared', 'chatgpt-plus', 'Shared', 'Budget-friendly access for everyday AI use.', 'available', 1),
  ('chatgpt-plus-private', 'chatgpt-plus', 'Private', 'A private account option with dedicated access.', 'available', 2),
  ('chatgpt-plus-own-mail', 'chatgpt-plus', 'Your own mail', 'ChatGPT Plus activated using your own email.', 'available', 3),
  ('grok-premium-default', 'grok-premium', 'Default', 'Standard subscription option.', 'out-of-stock', 1),
  ('adobe-creative-cloud-default', 'adobe-creative-cloud', 'Default', 'Ask admin for the current available plan.', 'dm-for-price', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  status = VALUES(status),
  sort_order = VALUES(sort_order);

INSERT INTO product_plan_durations (plan_id, label, price, original_price, status, sort_order)
VALUES
  ('chatgpt-plus-shared', '1 month', 15000, NULL, 'available', 1),
  ('chatgpt-plus-shared', '3 months', 42000, 45000, 'available', 2),
  ('chatgpt-plus-shared', '1 year', 150000, 180000, 'available', 3),
  ('chatgpt-plus-private', '1 month', 49000, NULL, 'available', 1),
  ('chatgpt-plus-private', '3 months', 140000, 147000, 'available', 2),
  ('chatgpt-plus-own-mail', '1 month', 135000, NULL, 'available', 1),
  ('grok-premium-default', '1 month', 12000, NULL, 'out-of-stock', 1),
  ('grok-premium-default', '3 months', 34000, 36000, 'out-of-stock', 2),
  ('adobe-creative-cloud-default', 'DM admin', 0, NULL, 'dm-for-price', 1)
ON DUPLICATE KEY UPDATE
  price = VALUES(price),
  original_price = VALUES(original_price),
  status = VALUES(status),
  sort_order = VALUES(sort_order);
