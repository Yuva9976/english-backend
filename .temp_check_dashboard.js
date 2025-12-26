(async ()=>{
  try {
    const loginRes = await fetch('http://localhost:4002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'learner@example.com', password: 'learn123' })
    });
    const login = await loginRes.json();
    console.log('LOGIN_RESULT:', JSON.stringify(login, null, 2));
    if (!login.token) return;
    const dashRes = await fetch('http://localhost:4002/api/dashboard/learner', {
      headers: { 'Authorization': 'Bearer ' + login.token }
    });
    const dash = await dashRes.json();
    console.log('DASH_RESULT:', JSON.stringify(dash, null, 2));
  } catch (err) {
    console.error('ERROR', err);
  }
})();
