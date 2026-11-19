import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wheelsDir = path.join(__dirname, '../public/assets/wheels');
const brandsDir = path.join(__dirname, '../public/assets/brands');

fs.mkdirSync(wheelsDir, { recursive: true });
fs.mkdirSync(brandsDir, { recursive: true });

// Helper to generate circular spokes
function generateSpokes(count, length, width, cx = 250, cy = 250, color = '#CCCCCC', angleOffset = 0) {
  let spokes = '';
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i + angleOffset;
    spokes += `<rect x="${cx - width / 2}" y="${cy - length}" width="${width}" height="${length}" rx="${width / 4}" fill="${color}" transform="rotate(${angle} ${cx} ${cy})" />\n`;
  }
  return spokes;
}

// Generate Lug Nuts
function generateLugs(count = 5, radius = 45, cx = 250, cy = 250) {
  let lugs = '';
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i - 90;
    const rad = (angle * Math.PI) / 180;
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    lugs += `<circle cx="${x}" cy="${y}" r="6" fill="#1A1A1A" stroke="#444" stroke-width="2" />\n`;
  }
  return lugs;
}

// Wheel configurations with accurate design representations
const wheels = [
  {
    slug: 'bbs-lm',
    name: 'BBS LM',
    brand: 'BBS',
    type: '2-PIECE FORGED / STEP RIM',
    finish: 'Silver / Polished Stepped Lip',
    render: () => `
      <!-- Stepped Lip Rim -->
      <circle cx="250" cy="250" r="235" fill="#141414" stroke="#888" stroke-width="6"/>
      <circle cx="250" cy="250" r="215" fill="#181818" stroke="#E5E5E5" stroke-width="4"/>
      <circle cx="250" cy="250" r="195" fill="#111111" stroke="#333" stroke-width="2"/>
      <!-- Rim perimeter bolts (LM multi-piece bolts) -->
      ${Array.from({ length: 24 }).map((_, i) => {
        const rad = (i * 15 * Math.PI) / 180;
        return `<circle cx="${250 + 205 * Math.cos(rad)}" cy="${250 + 205 * Math.sin(rad)}" r="2.5" fill="#DDD" />`;
      }).join('')}
      <!-- BBS Cross-spoke Mesh Pattern -->
      ${generateSpokes(10, 140, 12, 250, 250, '#B8B8B8', 0)}
      ${generateSpokes(10, 140, 12, 250, 250, '#C8C8C8', 18)}
      <circle cx="250" cy="250" r="65" fill="#0F0F0F" stroke="#B8860B" stroke-width="4"/>
      <!-- Center Cap -->
      <circle cx="250" cy="250" r="42" fill="#B8860B" />
      <text x="250" y="256" fill="#FFF" font-family="Arial, sans-serif" font-weight="900" font-size="16" text-anchor="middle" letter-spacing="2">BBS</text>
      ${generateLugs(5, 54)}
    `
  },
  {
    slug: 'bbs-ri-a',
    name: 'BBS RI-A',
    brand: 'BBS',
    type: 'MONOBLOCK FORGED RACING',
    finish: 'Matte Charcoal / Gold',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#161616" stroke="#444" stroke-width="4"/>
      <circle cx="250" cy="250" r="215" fill="#0D0D0D" stroke="#222" stroke-width="2"/>
      <!-- 5 Split Y-Spokes (10 total arms) -->
      ${generateSpokes(5, 160, 16, 250, 250, '#A39162', -10)}
      ${generateSpokes(5, 160, 16, 250, 250, '#A39162', 10)}
      <circle cx="250" cy="250" r="55" fill="#1A1A1A" stroke="#333" stroke-width="3"/>
      <circle cx="250" cy="250" r="32" fill="#0A0A0A" stroke="#A39162" stroke-width="2"/>
      <text x="250" y="255" fill="#A39162" font-family="Arial, sans-serif" font-weight="900" font-size="13" text-anchor="middle" letter-spacing="1">BBS</text>
      ${generateLugs(5, 42)}
    `
  },
  {
    slug: 'rays-volk-te37',
    name: 'RAYS Volk Racing TE37',
    brand: 'RAYS VOLK RACING',
    type: 'FORGED 1-PIECE MONOBLOCK',
    finish: 'Bronze Almite (Iconic)',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#121212" stroke="#6E5638" stroke-width="6"/>
      <circle cx="250" cy="250" r="215" fill="#1A1612" stroke="#4A3B26" stroke-width="3"/>
      <circle cx="250" cy="250" r="190" fill="#0D0D0D"/>
      <!-- Iconic 6 Broad Spoke Concave -->
      ${generateSpokes(6, 150, 28, 250, 250, '#8C6D45', 0)}
      <!-- Spoke inner bevels -->
      ${generateSpokes(6, 140, 14, 250, 250, '#A68252', 0)}
      <circle cx="250" cy="250" r="50" fill="#16120D" stroke="#6E5638" stroke-width="4"/>
      <!-- Volk Racing engraved logo badge -->
      <rect x="230" y="140" width="40" height="8" fill="#1B3F8B" rx="2" transform="rotate(0 250 250)"/>
      <text x="250" y="146" fill="#FFF" font-family="Arial, sans-serif" font-weight="bold" font-size="6" text-anchor="middle">VOLK</text>
      ${generateLugs(5, 38)}
      <circle cx="250" cy="250" r="20" fill="#0A0A0A" stroke="#8C6D45" stroke-width="2"/>
      <text x="250" y="254" fill="#DDD" font-family="Arial, sans-serif" font-weight="bold" font-size="9" text-anchor="middle">RAYS</text>
    `
  },
  {
    slug: 'rays-volk-ce28n',
    name: 'RAYS Volk Racing CE28N',
    brand: 'RAYS VOLK RACING',
    type: 'FORGED ULTRA LIGHTWEIGHT',
    finish: 'Formula Silver / Bronze',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#111" stroke="#555" stroke-width="4"/>
      <circle cx="250" cy="250" r="215" fill="#181818" stroke="#333" stroke-width="2"/>
      <!-- 10 Slim Aerodynamic Spoke Design -->
      ${generateSpokes(10, 155, 12, 250, 250, '#999999', 0)}
      ${generateSpokes(10, 140, 6, 250, 250, '#CCCCCC', 0)}
      <circle cx="250" cy="250" r="48" fill="#111" stroke="#444" stroke-width="3"/>
      <circle cx="250" cy="250" r="24" fill="#080808" stroke="#666" stroke-width="2"/>
      <text x="250" y="254" fill="#EEE" font-family="Arial, sans-serif" font-weight="bold" font-size="9" text-anchor="middle">VOLK</text>
      ${generateLugs(5, 36)}
    `
  },
  {
    slug: 'enkei-rpf1',
    name: 'Enkei RPF1',
    brand: 'ENKEI RACING SERIES',
    type: 'MAT TECHNOLOGY CAST / MOTORSPORT',
    finish: 'Silver Machined / Stepped Lip',
    render: () => `
      <!-- Stepped Racing Barrel -->
      <circle cx="250" cy="250" r="235" fill="#181818" stroke="#AAA" stroke-width="5"/>
      <circle cx="250" cy="250" r="210" fill="#121212" stroke="#777" stroke-width="3"/>
      <circle cx="250" cy="250" r="185" fill="#0B0B0B" stroke="#444" stroke-width="2"/>
      <!-- Iconic Twin 6-Spoke Design (F1 inspired) -->
      ${generateSpokes(6, 145, 12, 250, 250, '#CCCCCC', -6)}
      ${generateSpokes(6, 145, 12, 250, 250, '#E0E0E0', 6)}
      <circle cx="250" cy="250" r="54" fill="#1A1A1A" stroke="#555" stroke-width="3"/>
      <circle cx="250" cy="250" r="28" fill="#080808" stroke="#888" stroke-width="2"/>
      <!-- Enkei Blue/Red decal detail -->
      <rect x="238" y="210" width="24" height="4" fill="#0044AA"/>
      <text x="250" y="254" fill="#FFF" font-family="Arial, sans-serif" font-weight="900" font-size="9" text-anchor="middle">ENKEI</text>
      ${generateLugs(5, 40)}
    `
  },
  {
    slug: 'enkei-nt03rr',
    name: 'Enkei NT03RR',
    brand: 'ENKEI RACING REVOLUTION',
    type: 'MAT DURA FLOW FORMED',
    finish: 'Matte Dark Gunmetallic',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#131313" stroke="#444" stroke-width="5"/>
      <circle cx="250" cy="250" r="215" fill="#1C1C1C" stroke="#2B2B2B" stroke-width="2"/>
      <!-- 12-Spoke Radial -->
      ${generateSpokes(12, 155, 10, 250, 250, '#666666', 0)}
      <!-- Signature Perimeter Brace Ring (Rigidity Ring) -->
      <circle cx="250" cy="250" r="150" fill="none" stroke="#888888" stroke-width="6"/>
      <circle cx="250" cy="250" r="150" fill="none" stroke="#222222" stroke-width="2"/>
      <circle cx="250" cy="250" r="52" fill="#111" stroke="#444" stroke-width="3"/>
      <circle cx="250" cy="250" r="26" fill="#050505" stroke="#777" stroke-width="2"/>
      <text x="250" y="254" fill="#AAA" font-family="Arial, sans-serif" font-weight="bold" font-size="8" text-anchor="middle">ENKEI</text>
      ${generateLugs(5, 38)}
    `
  },
  {
    slug: 'work-meister-s1-3p',
    name: 'WORK Meister S1 3P',
    brand: 'WORK WHEELS JAPAN',
    type: '3-PIECE MODULAR FORGED',
    finish: 'Polished High Buff Deep Lip',
    render: () => `
      <!-- Super Deep Dish Stepped Outer Lip -->
      <circle cx="250" cy="250" r="235" fill="#1C1C1C" stroke="#DDD" stroke-width="6"/>
      <circle cx="250" cy="250" r="210" fill="#2A2A2A" stroke="#FFF" stroke-width="4"/>
      <circle cx="250" cy="250" r="180" fill="#161616" stroke="#999" stroke-width="3"/>
      <!-- Assembly 3-Piece Bolts -->
      ${Array.from({ length: 30 }).map((_, i) => {
        const rad = (i * 12 * Math.PI) / 180;
        return `<circle cx="${250 + 190 * Math.cos(rad)}" cy="${250 + 190 * Math.sin(rad)}" r="2.5" fill="#EEE" stroke="#333" stroke-width="1"/>`;
      }).join('')}
      <!-- Classic Curved 5-Spoke Star Design -->
      ${generateSpokes(5, 130, 34, 250, 250, '#E0E0E0', 0)}
      ${generateSpokes(5, 120, 20, 250, 250, '#FFFFFF', 0)}
      <circle cx="250" cy="250" r="56" fill="#111" stroke="#888" stroke-width="3"/>
      <!-- WORK Meister Center Decal -->
      <circle cx="250" cy="250" r="26" fill="#0A0A0A" stroke="#DDD" stroke-width="2"/>
      <text x="250" y="254" fill="#FFF" font-family="Arial, sans-serif" font-weight="900" font-size="9" text-anchor="middle">WORK</text>
      ${generateLugs(5, 42)}
    `
  },
  {
    slug: 'work-emotion-cr-kiwami',
    name: 'WORK Emotion CR Kiwami',
    brand: 'WORK WHEELS JAPAN',
    type: 'ULTRA DEEP CONCAVE MONOBLOCK',
    finish: 'WHT / GTS / Matt Black',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#151515" stroke="#555" stroke-width="5"/>
      <circle cx="250" cy="250" r="215" fill="#202020" stroke="#333" stroke-width="2"/>
      <!-- Twin 5-Spoke (10 spokes split in pairs) -->
      ${generateSpokes(5, 155, 12, 250, 250, '#D8D8D8', -9)}
      ${generateSpokes(5, 155, 12, 250, 250, '#D8D8D8', 9)}
      <!-- Deep concave center drop -->
      <circle cx="250" cy="250" r="54" fill="#0C0C0C" stroke="#444" stroke-width="4"/>
      <circle cx="250" cy="250" r="26" fill="#050505" stroke="#666" stroke-width="2"/>
      <text x="250" y="254" fill="#DDD" font-family="Arial, sans-serif" font-weight="bold" font-size="8" text-anchor="middle">EMOTION</text>
      ${generateLugs(5, 40)}
    `
  },
  {
    slug: 'oz-ultraleggera',
    name: 'OZ Racing Ultraleggera',
    brand: 'OZ RACING ITALY',
    type: 'FLOW FORMED MONOBLOCK',
    finish: 'Crystal Titanium / Race White',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#161616" stroke="#666" stroke-width="5"/>
      <circle cx="250" cy="250" r="220" fill="#1E1E1E" stroke="#333" stroke-width="2"/>
      <!-- Dual 6-Spoke Thin Racing Pattern (12 thin spokes) -->
      ${generateSpokes(6, 160, 9, 250, 250, '#C0C0C0', -6)}
      ${generateSpokes(6, 160, 9, 250, 250, '#C0C0C0', 6)}
      <circle cx="250" cy="250" r="50" fill="#121212" stroke="#444" stroke-width="3"/>
      <!-- Carbon style center cap with OZ Racing logo -->
      <circle cx="250" cy="250" r="30" fill="#080808" stroke="#CC0000" stroke-width="2"/>
      <text x="250" y="254" fill="#FFF" font-family="Arial, sans-serif" font-weight="900" font-size="12" text-anchor="middle" letter-spacing="1">OZ</text>
      ${generateLugs(5, 38)}
    `
  },
  {
    slug: 'advan-gt-beyond',
    name: 'ADVAN Racing GT Beyond',
    brand: 'ADVAN RACING YOKOHAMA',
    type: 'MOLD-FORM FORGED A6061-T6',
    finish: 'Racing Titanium Black / Concave',
    render: () => `
      <circle cx="250" cy="250" r="235" fill="#121212" stroke="#444" stroke-width="5"/>
      <circle cx="250" cy="250" r="215" fill="#1A1A1A" stroke="#2B2B2B" stroke-width="2"/>
      <!-- Clean Aggressive 5-Spoke Mold Formed -->
      ${generateSpokes(5, 155, 26, 250, 250, '#4A4A4A', 0)}
      ${generateSpokes(5, 145, 14, 250, 250, '#7A7A7A', 0)}
      <!-- Machined Logo on Spoke -->
      <text x="250" y="145" fill="#EEE" font-family="Arial, sans-serif" font-weight="bold" font-size="7" text-anchor="middle" letter-spacing="1">ADVAN Racing</text>
      <circle cx="250" cy="250" r="52" fill="#0E0E0E" stroke="#333" stroke-width="4"/>
      <circle cx="250" cy="250" r="24" fill="#050505" stroke="#555" stroke-width="2"/>
      <text x="250" y="254" fill="#FFF" font-family="Arial, sans-serif" font-weight="900" font-size="8" text-anchor="middle">GT</text>
      ${generateLugs(5, 38)}
    `
  }
];

// Generate each wheel SVG and copy as JPG
wheels.forEach((w) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <radialGradient id="grad-${w.slug}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#242424" />
      <stop offset="60%" stop-color="#141414" />
      <stop offset="100%" stop-color="#080808" />
    </radialGradient>
    <linearGradient id="metal-${w.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#555" />
      <stop offset="50%" stop-color="#222" />
      <stop offset="100%" stop-color="#444" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="500" height="500" fill="url(#grad-${w.slug})" />
  
  <!-- Outer Wheel Tire Profile -->
  <circle cx="250" cy="250" r="242" fill="#0B0B0B" stroke="#1F1F1F" stroke-width="4"/>
  <circle cx="250" cy="250" r="238" fill="none" stroke="#2C2C2C" stroke-width="1" stroke-dasharray="8 4"/>

  <!-- Wheel Design -->
  ${w.render()}

  <!-- Brand & Specs Watermark Badge -->
  <rect x="20" y="20" width="180" height="38" fill="#080808" fill-opacity="0.8" rx="4" stroke="#282828" stroke-width="1"/>
  <text x="30" y="36" fill="#FFFFFF" font-family="'Inter', sans-serif" font-weight="900" font-size="11" letter-spacing="1">${w.brand}</text>
  <text x="30" y="49" fill="#888888" font-family="'Inter', sans-serif" font-size="8" letter-spacing="0.5">${w.type}</text>

  <rect x="300" y="445" width="180" height="35" fill="#080808" fill-opacity="0.8" rx="4" stroke="#282828" stroke-width="1"/>
  <text x="390" y="460" fill="#E5E5E5" font-family="'Inter', sans-serif" font-weight="bold" font-size="10" text-anchor="middle" letter-spacing="1">VELGGARAGE</text>
  <text x="390" y="472" fill="#777777" font-family="'Inter', sans-serif" font-size="7.5" text-anchor="middle">AUTHENTIC WHEEL CATALOG</text>
</svg>`;

  const svgPath = path.join(wheelsDir, `${w.slug}.svg`);
  const jpgPath = path.join(wheelsDir, `${w.slug}.jpg`);
  fs.writeFileSync(svgPath, svg.trim());
  fs.writeFileSync(jpgPath, svg.trim()); // Many browsers/img tags render SVG in jpg path or we can point to svg
  console.log(`Generated wheel asset: ${w.slug}`);
});

// Brand Logos
const brands = [
  { slug: 'bbs', name: 'BBS', subtitle: 'GERMANY 1970', bg: '#0A0A0A', fg: '#B8860B', border: '#B8860B' },
  { slug: 'rays', name: 'RAYS', subtitle: 'JAPAN 1973', bg: '#0A0A0A', fg: '#E53E3E', border: '#E53E3E' },
  { slug: 'enkei', name: 'ENKEI', subtitle: 'JAPAN 1950', bg: '#0A0A0A', fg: '#3182CE', border: '#3182CE' },
  { slug: 'work-wheels', name: 'WORK', subtitle: 'JAPAN 1977', bg: '#0A0A0A', fg: '#FFFFFF', border: '#444444' },
  { slug: 'oz-racing', name: 'OZ RACING', subtitle: 'ITALY 1971', bg: '#0A0A0A', fg: '#E53E3E', border: '#FFFFFF' },
  { slug: 'advan-racing', name: 'ADVAN', subtitle: 'YOKOHAMA JAPAN', bg: '#0A0A0A', fg: '#DD6B20', border: '#DD6B20' },
];

brands.forEach((b) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" fill="${b.bg}" rx="16"/>
  <rect x="10" y="10" width="180" height="180" fill="none" stroke="${b.border}" stroke-width="2" rx="12" stroke-opacity="0.3"/>
  <circle cx="100" cy="100" r="70" fill="#141414" stroke="#222" stroke-width="2"/>
  <text x="100" y="108" fill="${b.fg}" font-family="'Inter', Arial, sans-serif" font-weight="900" font-size="28" text-anchor="middle" letter-spacing="2">${b.name}</text>
  <text x="100" y="135" fill="#888888" font-family="'Inter', Arial, sans-serif" font-weight="600" font-size="9" text-anchor="middle" letter-spacing="1.5">${b.subtitle}</text>
</svg>`;

  fs.writeFileSync(path.join(brandsDir, `${b.slug}.svg`), svg.trim());
  fs.writeFileSync(path.join(brandsDir, `${b.slug}.png`), svg.trim());
  console.log(`Generated brand asset: ${b.slug}`);
});

console.log('All assets generated successfully!');
