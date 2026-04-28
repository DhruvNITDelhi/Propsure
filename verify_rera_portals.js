const https = require('https');
const http = require('http');

const portals = {
  'Maharashtra': 'https://maharera.mahaonline.gov.in',
  'Karnataka': 'https://rera.karnataka.gov.in',
  'Delhi': 'https://rera.delhi.gov.in',
  'Uttar Pradesh': 'https://www.up-rera.in',
  'Gujarat': 'https://gujrera.gujarat.gov.in',
  'Rajasthan': 'https://rera.rajasthan.gov.in',
  'Haryana': 'https://haryanarera.gov.in',
  'Tamil Nadu': 'https://www.tnrera.in',
  'Telangana': 'https://rera.telangana.gov.in',
  'Kerala': 'https://rera.kerala.gov.in',
  'West Bengal': 'https://hira.wb.gov.in',
  'Madhya Pradesh': 'https://www.mprera.gov.in',
  'Punjab': 'https://www.prera.in',
  'Bihar': 'https://rerabihar.gov.in',
  'Odisha': 'https://rera.odisha.gov.in',
  'Andhra Pradesh': 'https://rera.ap.gov.in'
};

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  },
  timeout: 10000,
  rejectUnauthorized: false
};

function checkUrl(name, url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, options, (res) => {
      resolve({ name, url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ name, url, status: 'Error', details: err.message });
    }).on('timeout', () => {
      req.destroy();
      resolve({ name, url, status: 'Timeout' });
    });
  });
}

async function run() {
  console.log('| State | URL | Status |');
  console.log('|-------|-----|--------|');
  const results = [];
  for (const [name, url] of Object.entries(portals)) {
    const res = await checkUrl(name, url);
    console.log(`| ${res.name} | ${res.url} | ${res.status} |`);
    results.push(res);
  }
}

run();
