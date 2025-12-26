const fs = require('fs');
(async ()=>{
  try {
    const loginRes = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'learner@example.com', password: 'learn123' })
    });
    const login = await loginRes.json();
    const out = { login };
    if (login.token) {
      const dashRes = await fetch('http://localhost:4000/api/dashboard/learner', {
        headers: { 'Authorization': 'Bearer ' + login.token }
      });
      out.dashboard = await dashRes.json();
    }
    fs.writeFileSync('.temp_dashboard_out.json', JSON.stringify(out, null, 2));
    console.log('WROTE .temp_dashboard_out.json');
  } catch (err) {
    console.error('ERROR', err);
    fs.writeFileSync('.temp_dashboard_out.json', JSON.stringify({ error: String(err) }));
  }
})();
