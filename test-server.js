const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/health',
  method: 'GET',
};

const req = http.request(options, res => {
  console.log(`✅ Servidor respondiendo en puerto 4000`);
  console.log(`Status: ${res.statusCode}`);

  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', e => {
  console.log(`❌ Error conectando al puerto 4000: ${e.message}`);
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.log('❌ Timeout - servidor no responde');
  req.destroy();
  process.exit(1);
});

req.end();
