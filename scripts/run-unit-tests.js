/**
 * Comprehensive Unit Test Suite
 * Tests:
 * 1. Money & Paise calculations
 * 2. Indian Currency Formatting (formatINR)
 * 3. Amount in Words (Indian numbering system)
 * 4. Video URL Parser (YouTube, Vimeo, Facebook, Google Drive, direct MP4, XSS rejection)
 * 5. AES-256-GCM Encryption / Decryption roundtrip
 * 6. Dynamic UPI URI builder
 * 7. Indian Financial Year calculator
 */

const crypto = require('crypto');

// --- 1 & 2 & 3: Money & Words Helpers ---
function paiseToRupees(paise) {
  return Math.round(paise) / 100;
}

function rupeesToPaise(rupees) {
  return Math.round(rupees * 100);
}

function formatINR(amount, showDecimals = false) {
  const parts = amount.toFixed(showDecimals ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `₹${formattedInteger}${decimalPart ? '.' + decimalPart : ''}`;
}

function amountInWords(rupees) {
  const num = Math.floor(Math.abs(rupees));
  if (num === 0) return 'Rupees Zero Only';

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
  }

  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    if (hundred > 0) {
      const restWords = rest > 0 ? ` and ${convertTwoDigits(rest)}` : '';
      return `${a[hundred]} Hundred${restWords}`.trim();
    }
    return convertTwoDigits(rest);
  }

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  const words = [];
  if (crore > 0) words.push(`${convertTwoDigits(crore)} Crore`);
  if (lakh > 0) words.push(`${convertTwoDigits(lakh)} Lakh`);
  if (thousand > 0) words.push(`${convertTwoDigits(thousand)} Thousand`);
  if (remainder > 0) words.push(convertThreeDigits(remainder));

  return `Rupees ${words.join(' ').replace(/\s+/g, ' ').trim()} Only`;
}

// --- 4: Video URL Parser ---
function parseVideoUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') throw new Error('Video URL required');
  let url;
  try {
    url = new URL(urlStr.trim());
  } catch {
    throw new Error('Invalid URL format');
  }

  const host = url.hostname.toLowerCase();
  const pathname = url.pathname;

  if (
    host === 'youtube.com' ||
    host === 'www.youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtu.be'
  ) {
    let videoId = '';
    if (host === 'youtu.be') videoId = pathname.slice(1).split('/')[0];
    else if (pathname.startsWith('/watch')) videoId = url.searchParams.get('v') || '';
    else if (pathname.startsWith('/embed/')) videoId = pathname.replace('/embed/', '').split('/')[0];
    else if (pathname.startsWith('/shorts/')) videoId = pathname.replace('/shorts/', '').split('/')[0];

    videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!videoId) throw new Error('Invalid YouTube ID');

    return {
      provider: 'YOUTUBE',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  if (host === 'vimeo.com' || host === 'www.vimeo.com') {
    const id = pathname.split('/').filter(Boolean).pop();
    if (!id || !/^\d+$/.test(id)) throw new Error('Invalid Vimeo ID');
    return {
      provider: 'VIMEO',
      videoId: id,
      embedUrl: `https://player.vimeo.com/video/${id}`,
    };
  }

  if (host === 'drive.google.com') {
    const match = pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const id = match ? match[1] : '';
    if (!id) throw new Error('Invalid Google Drive ID');
    return {
      provider: 'GOOGLE_DRIVE',
      videoId: id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
    };
  }

  if (pathname.endsWith('.mp4') || pathname.endsWith('.webm')) {
    return {
      provider: 'DIRECT_MP4',
      videoId: pathname.split('/').pop(),
      embedUrl: url.toString(),
    };
  }

  throw new Error(`Unsupported host: ${host}`);
}

// --- 5: Encryption Service ---
function encryptAES(text, keyHex) {
  const key = crypto.createHash('sha256').update(keyHex).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

function decryptAES(cipherText, keyHex) {
  const parts = cipherText.split(':');
  if (parts.length !== 3) throw new Error('Malformed ciphertext');
  const [ivHex, tagHex, encryptedHex] = parts;
  const key = crypto.createHash('sha256').update(keyHex).digest();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// --- 6: UPI URI Builder ---
function buildUpiUri(vpa, payeeName, amountRupees, refId, sevaCode) {
  const am = amountRupees.toFixed(2);
  const tn = `${refId} ${sevaCode}`.trim();
  return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payeeName)}&am=${am}&cu=INR&tn=${encodeURIComponent(tn)}`;
}

// --- 7: Financial Year Calculator ---
function getFinancialYear(date, startMonth = 4) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let fyStart = month >= startMonth ? year : year - 1;
  let fyEnd = fyStart + 1;
  return `${fyStart}-${String(fyEnd).slice(-2)}`;
}

// ==========================================
// TEST RUNNER
// ==========================================

console.log('🧪 RUNNING KUSHBHAWANPUR UNIT TEST SUITE...\n');

let passed = 0;
let failed = 0;

function assert(name, condition, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${name} ${details}`);
    failed++;
  }
}

// Test 1: Money & Paise
console.log('1. Testing Money & Paise conversions:');
assert('10000 paise = 100 rupees', paiseToRupees(10000) === 100);
assert('2100 rupees = 210000 paise', rupeesToPaise(2100) === 210000);
assert('501.50 rupees = 50150 paise', rupeesToPaise(501.5) === 50150);

// Test 2: formatINR
console.log('\n2. Testing Indian Currency Formatting (formatINR):');
assert('₹501 format', formatINR(501) === '₹501');
assert('₹1,100 format', formatINR(1100) === '₹1,100');
assert('₹1,25,000 format', formatINR(125000) === '₹1,25,000');
assert('₹10,50,000 format', formatINR(1050000) === '₹10,50,000');
assert('₹1,00,00,000 (One Crore) format', formatINR(10000000) === '₹1,00,00,000');

// Test 3: Amount in words
console.log('\n3. Testing Indian Amount in Words:');
assert('₹501 in words', amountInWords(501) === 'Rupees Five Hundred and One Only');
assert('₹2,100 in words', amountInWords(2100) === 'Rupees Two Thousand One Hundred Only');
assert(
  '₹1,25,000 in words',
  amountInWords(125000) === 'Rupees One Lakh Twenty Five Thousand Only'
);
assert(
  '₹2,50,100 in words',
  amountInWords(250100) === 'Rupees Two Lakh Fifty Thousand One Hundred Only'
);

// Test 4: Video URL Parser
console.log('\n4. Testing Video URL Parser:');
const yt1 = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
assert('YouTube watch URL', yt1.provider === 'YOUTUBE' && yt1.videoId === 'dQw4w9WgXcQ');
assert('YouTube lite embed nocookie', yt1.embedUrl === 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');

const yt2 = parseVideoUrl('https://youtu.be/dQw4w9WgXcQ');
assert('YouTube short URL', yt2.videoId === 'dQw4w9WgXcQ');

const vimeo = parseVideoUrl('https://vimeo.com/76979871');
assert('Vimeo URL', vimeo.provider === 'VIMEO' && vimeo.videoId === '76979871');

const drive = parseVideoUrl('https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view');
assert('Google Drive URL', drive.provider === 'GOOGLE_DRIVE');

let xssCaught = false;
try {
  parseVideoUrl('javascript:alert("XSS")');
} catch {
  xssCaught = true;
}
assert('XSS / Malicious URL rejection', xssCaught === true);

// Test 5: AES-256-GCM Encryption
console.log('\n5. Testing AES-256-GCM Encryption / Decryption:');
const testPan = 'ABCDE1234F';
const testKey = 'test-secret-key-32-characters-min!';
const encrypted = encryptAES(testPan, testKey);
assert('Ciphertext format contains 3 components (iv:tag:data)', encrypted.split(':').length === 3);
const decrypted = decryptAES(encrypted, testKey);
assert('Decryption round-trip matches original PAN', decrypted === testPan);

// Test 6: UPI URI Builder
console.log('\n6. Testing Dynamic UPI URI Builder:');
const upiUri = buildUpiUri('seva@trust', 'Kushbhawanpur Foundation', 2100, 'KSDHF-7K3Q9M', 'GauSeva');
assert('UPI URI starts with upi://pay', upiUri.startsWith('upi://pay'));
assert('UPI URI has exact amount with 2 decimals (am=2100.00)', upiUri.includes('am=2100.00'));
assert('UPI URI contains reference in transaction note (tn=...)', upiUri.includes('KSDHF-7K3Q9M'));

// Test 7: Financial Year Calculation
console.log('\n7. Testing Indian Financial Year calculation:');
const aprilDate = new Date('2026-04-15');
const marchDate = new Date('2027-03-10');
assert('April 2026 is FY 2026-27', getFinancialYear(aprilDate) === '2026-27');
assert('March 2027 is FY 2026-27', getFinancialYear(marchDate) === '2026-27');

console.log(`\n==========================================`);
console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED.`);
console.log(`==========================================`);

if (failed > 0) process.exit(1);
