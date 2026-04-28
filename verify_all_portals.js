const https = require('https');
const http = require('http');

const portals = {
  'Uttar Pradesh': 'https://upbhulekh.gov.in',
  'Maharashtra': 'https://bhulekh.mahabhumi.gov.in',
  'Karnataka': 'https://bhoomi.karnataka.gov.in',
  'Rajasthan': 'https://apnakhata.rajasthan.gov.in',
  'Madhya Pradesh': 'https://mpbhulekh.gov.in',
  'Bihar': 'https://biharbhumi.bihar.gov.in',
  'Haryana': 'https://jamabandi.nic.in',
  'Punjab': 'https://plrs.org.in',
  'Gujarat': 'https://anyror.gujarat.gov.in',
  'Tamil Nadu': 'https://eservices.tn.gov.in',
  'Telangana': 'https://dharani.telangana.gov.in',
  'Kerala': 'https://erekha.kerala.gov.in',
  'West Bengal': 'https://banglarbhumi.gov.in',
  'Odisha': 'https://bhulekh.ori.nic.in',
  'Delhi': 'https://dlrc.delhi.gov.in',
  'Himachal Pradesh': 'https://ehimbhoomi.nic.in',
  'Uttarakhand': 'https://bhulekh.uk.gov.in',
  'Chhattisgarh': 'https://bhuiyan.cg.nic.in',
  'Jharkhand': 'https://jharbhoomi.jharkhand.gov.in',
  'Assam': 'https://revenueassam.nic.in',
  'Andhra Pradesh': 'https://meebhoomi.ap.gov.in',
  'Goa': 'https://dslr.goa.gov.in',
  'Tripura': 'https://jami.tripura.gov.in'
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
