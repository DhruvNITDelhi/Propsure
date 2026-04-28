const https = require('https');
const http = require('http');

const urls = [
  'https://upbhulekh.gov.in',
  'https://bhulekh.mahabhumi.gov.in',
  'https://bhoomi.karnataka.gov.in',
  'https://apnakhata.raj.nic.in',
  'https://mpbhulekh.gov.in',
  'https://biharbhumi.bihar.gov.in',
  'https://jamabandi.nic.in',
  'https://plrs.org.in',
  'https://anyror.gujarat.gov.in',
  'https://eservices.tn.gov.in',
  'https://dharani.telangana.gov.in',
  'https://erekha.kerala.gov.in',
  'https://banglarbhumi.gov.in',
  'https://bhulekh.ori.nic.in',
  'https://dlrc.delhigovt.nic.in',
  'https://himbhoomi.nic.in',
  'https://bhulekh.uk.gov.in',
  'https://bhuiyan.cg.nic.in',
  'https://jharbhoomi.nic.in',
  'https://dharitree.assam.gov.in'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = url.startsWith('https') ? https : http;
    const request = req.get(url, { rejectUnauthorized: false, timeout: 5000 }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'Error', error: err.message });
    }).on('timeout', () => {
      request.abort();
      resolve({ url, status: 'Timeout' });
    });
  });
}

async function run() {
  console.log('Checking URLs...');
  for (const url of urls) {
    const result = await checkUrl(url);
    console.log(`${result.status} - ${result.url} ${result.error ? '(' + result.error + ')' : ''}`);
  }
}

run();
