-- ============================================================
-- VelgGarage Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ── Brands ───────────────────────────────────────────────────
INSERT INTO brands (id, name, slug, country, founded_year, website_url, logo_url, description)
VALUES
  (1, 'BBS', 'bbs', 'Germany', 1970, 'https://www.bbs.com', '/assets/brands/BBS-Symbol.png',
   'BBS is a renowned German wheel manufacturer known for high-performance multi-piece and forged wheels used in motorsport and premium vehicles.'),
  (2, 'RAYS', 'rays', 'Japan', 1973, 'https://www.rayswheels.co.jp', '/assets/brands/Rays-Wheels.webp',
   'RAYS is a Japanese wheel manufacturer famous for the Volk Racing series of lightweight forged wheels used extensively in motorsport worldwide.'),
  (3, 'Enkei', 'enkei', 'Japan', 1950, 'https://www.enkei.com', '/assets/brands/enkei-1-logo.png',
   'Enkei is one of Japan''s largest wheel manufacturers, producing OEM and aftermarket wheels known for exceptional quality and advanced MAT technology.'),
  (4, 'WORK Wheels', 'work-wheels', 'Japan', 1977, 'https://www.work-wheels.co.jp', '/assets/brands/WORK_WHEELS.svg',
   'WORK Wheels is a Japanese manufacturer specializing in custom multi-piece and monoblock wheels with a wide range of finishes.'),
  (5, 'OZ Racing', 'oz-racing', 'Italy', 1971, 'https://www.ozracing.com', '/assets/brands/oz-racing-logo.png',
   'OZ Racing is an Italian wheel manufacturer with a strong motorsport heritage, supplying wheels for Formula 1, WRC, and premium automotive enthusiasts.'),
  (6, 'ADVAN Racing', 'advan-racing', 'Japan', 1996, 'https://www.yokohamaspeedgear.com', '/assets/brands/Advan-Logo.png',
   'ADVAN Racing is Yokohama''s performance wheel brand, producing lightweight forged and flow-formed wheels designed for track and street performance.')
ON CONFLICT (slug) DO NOTHING;

-- Reset sequence after explicit id inserts
SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));

-- ── Products ──────────────────────────────────────────────────
INSERT INTO products (id, brand_id, name, slug, model, category, construction_type, material, is_featured, price, stock, image_url, manufacturer_source_url, description)
VALUES
  (1,  1, 'BBS LM', 'bbs-lm', 'LM', 'Sport', 'Multi-piece', 'Cast aluminum center, spun aluminum rim', TRUE, 52000000, 3,
   '/assets/wheels/bbs-lm.webp', 'https://www.bbs.com',
   'The BBS LM is an iconic two-piece wheel featuring a cast center with a spun rim. Known for its distinctive polished lip and timeless design, it has been a favorite for tuners worldwide.'),

  (2,  1, 'BBS RI-A', 'bbs-ri-a', 'RI-A', 'Racing', 'Monoblock', 'Forged aluminum', FALSE, 49500000, 4,
   '/assets/wheels/bbs-ri-a.png', 'https://www.bbs.com',
   'The BBS RI-A is a lightweight forged monoblock racing wheel designed for motorsport applications. Its minimal design prioritizes strength and low unsprung weight.'),

  (3,  2, 'RAYS Volk Racing TE37', 'rays-volk-te37', 'Volk Racing TE37', 'Sport', 'Monoblock', 'Forged aluminum', TRUE, 46000000, 2,
   '/assets/wheels/te-37.png', 'https://www.rayswheels.co.jp',
   'The Volk Racing TE37 is one of the most iconic wheels ever made. Its 6-spoke forged design has been used in time attack, circuit racing, and street builds worldwide. Available in multiple sizes and finishes.'),

  (4,  2, 'RAYS Volk Racing CE28N', 'rays-volk-ce28n', 'Volk Racing CE28N', 'Sport', 'Monoblock', 'Forged aluminum', FALSE, 44000000, 5,
   '/assets/wheels/ce-28-n.webp', 'https://www.rayswheels.co.jp',
   'The CE28N features a 10-spoke forged design optimized for high-speed stability and aerodynamic efficiency. A popular choice for performance street and track use.'),

  (5,  3, 'Enkei RPF1', 'enkei-rpf1', 'RPF1', 'Sport', 'Monoblock', 'Cast aluminum (MAT Technology)', TRUE, 28500000, 8,
   '/assets/wheels/enkei-RPFT-1.png', 'https://www.enkei.com',
   'The Enkei RPF1 uses Enkei''s proprietary MAT (Most Advanced Technology) manufacturing process, producing a lightweight cast wheel with exceptional strength. Widely used in time attack and rally.'),

  (6,  3, 'Enkei NT03RR', 'enkei-nt03rr', 'NT03RR', 'Sport', 'Monoblock', 'Flow formed aluminum', FALSE, 32000000, 4,
   '/assets/wheels/Enkei-NT03RR.png', 'https://www.enkei.com',
   'The NT03RR features a 5-spoke design produced using flow forming technology, delivering reduced weight and improved strength over conventional casting. Designed for sport compact applications.'),

  (7,  4, 'WORK Meister S1 3P', 'work-meister-s1-3p', 'Meister S1 3P', 'Custom', 'Multi-piece (3-piece)', 'Forged center, spun rims', FALSE, 58000000, 2,
   '/assets/wheels/WORK-Meister-S1-3P.png', 'https://www.work-wheels.co.jp',
   'The WORK Meister S1 3P is a fully customizable 3-piece wheel combining a forged center with spun aluminum inner and outer rims. Available in a vast range of sizes, offsets, and finishes.'),

  (8,  4, 'WORK Emotion CR Kiwami', 'work-emotion-cr-kiwami', 'Emotion CR Kiwami', 'Sport', 'Monoblock', 'Cast aluminum', FALSE, 31000000, 6,
   '/assets/wheels/WORK-Emotion-CR-Kiwami.png', 'https://www.work-wheels.co.jp',
   'The Emotion CR Kiwami features an aggressive 10-spoke design with a deep concave profile. It offers a premium aesthetic for street and show applications.'),

  (9,  5, 'OZ Racing Ultraleggera', 'oz-ultraleggera', 'Ultraleggera', 'Racing', 'Monoblock', 'Flow formed aluminum', TRUE, 36500000, 5,
   '/assets/wheels/OZ-Racing-Ultraleggera.png', 'https://www.ozracing.com',
   'The OZ Ultraleggera (meaning "ultra light" in Italian) is a flow-formed monoblock wheel designed for weight reduction. Its 10-spoke design is both functional and visually striking.'),

  (10, 6, 'ADVAN Racing GT Beyond', 'advan-gt-beyond', 'GT Beyond', 'Racing', 'Monoblock', 'Forged aluminum', TRUE, 47500000, 3,
   '/assets/wheels/advan-racing-gt-beyond-racing.webp', 'https://www.yokohamaspeedgear.com',
   'The ADVAN Racing GT Beyond is a forged monoblock wheel evolved from ADVAN''s motorsport heritage. Features a 10-spoke design with a distinctive machined finish and excellent rigidity-to-weight ratio.')
ON CONFLICT (slug) DO NOTHING;

SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- ── Product Specifications ────────────────────────────────────
INSERT INTO product_specifications (product_id, diameter, width, pcd, offset_range, finish)
VALUES
  -- BBS LM
  (1,  18.0, 8.5,  '5x114.3', '+35', 'Gold'),
  (1,  18.0, 9.5,  '5x114.3', '+38', 'Silver'),
  -- BBS RI-A
  (2,  18.0, 9.0,  '5x114.3', '+45', 'Gold'),
  -- RAYS TE37
  (3,  15.0, 8.0,  '4x100',   '+35', 'Bronze'),
  (3,  17.0, 9.0,  '5x114.3', '+35', 'Silver'),
  (3,  18.0, 9.5,  '5x114.3', '+38', 'Black'),
  -- RAYS CE28N
  (4,  17.0, 9.0,  '5x114.3', '+35', 'Bronze'),
  (4,  18.0, 9.5,  '5x114.3', '+38', 'Silver'),
  -- Enkei RPF1
  (5,  15.0, 7.0,  '4x100',   '+35', 'Silver'),
  (5,  16.0, 7.5,  '4x100',   '+35', 'Silver'),
  (5,  17.0, 8.0,  '5x114.3', '+35', 'Silver'),
  (5,  18.0, 8.5,  '5x114.3', '+38', 'Silver'),
  -- Enkei NT03RR
  (6,  18.0, 8.5,  '5x114.3', '+35', 'Matte Black'),
  -- WORK Meister S1 3P
  (7,  17.0, 8.0,  '5x114.3', '+30', 'Polished'),
  (7,  18.0, 10.0, '5x114.3', '+15', 'Polished'),
  -- WORK Emotion CR Kiwami
  (8,  18.0, 8.5,  '5x114.3', '+35', 'White'),
  (8,  19.0, 9.5,  '5x114.3', '+38', 'Black'),
  -- OZ Ultraleggera
  (9,  17.0, 7.0,  '5x112',   '+35', 'White'),
  (9,  18.0, 8.0,  '5x112',   '+35', 'White'),
  (9,  19.0, 8.5,  '5x112',   '+40', 'White'),
  -- ADVAN GT Beyond
  (10, 18.0, 9.5,  '5x114.3', '+35', 'Racing Hyper Black'),
  (10, 20.0, 10.0, '5x114.3', '+35', 'Racing White');
