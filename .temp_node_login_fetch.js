const http = require('http');
const data = JSON.stringify({ email: 'learner@example.com', password: 'learn123' });
const opts = { hostname: 'localhost', port: 4000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } };
const req = http.request(opts, (res)=>{
  let buf = '';
  res.setEncoding('utf8');
  res.on('data', d=> buf+=d);
  res.on('end', ()=>{
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', JSON.stringify(res.headers));
    console.log('BODY', buf);
  });
});
req.on('error', (e)=>{ console.error('ERR', e); });
req.write(data);
req.end();
