const fs = require('fs');
const path = require('path');
(async ()=>{
  const out = { steps: [] };
  try{
    const backend = 'http://localhost:4000';
    const models = require('./models');
    const { User, Classroom, sequelize } = models;
    // ensure DB tables exist (create/alter as needed)
    await sequelize.sync({ alter: true });
    // ensure teacher exists
    let teacher = await User.findOne({ where: { email: 'teacher@example.com' } });
    if(!teacher){
      const bcrypt = require('bcrypt');
      const hash = await bcrypt.hash('teach123', 10);
      teacher = await User.create({ name: 'Seed Teacher', email: 'teacher@example.com', password_hash: hash, role: 'teacher' });
      out.steps.push({ createdTeacher: teacher.id });
    } else {
      out.steps.push({ teacherFound: teacher.id });
    }

    // create classroom
    let cls = await Classroom.findOne({ where: { title: 'E2E Test Class' } });
    if(!cls){
      cls = await Classroom.create({ title: 'E2E Test Class', description: 'E2E class', teacher_id: teacher.id });
      out.steps.push({ createdClass: cls.id });
    } else out.steps.push({ classFound: cls.id });

    // helper: login
    async function login(email, password){
      const res = await fetch(backend + '/api/auth/login', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ email, password }) });
      const j = await res.json();
      return j;
    }

    const tLogin = await login('teacher@example.com','teach123');
    out.teacherLogin = tLogin;
    if(!tLogin.token) throw new Error('teacher login failed');

    // create session
    const createSess = await fetch(backend + '/api/classroom/session/create', { method: 'POST', headers: { 'content-type':'application/json', Authorization: 'Bearer '+tLogin.token }, body: JSON.stringify({ classId: cls.id }) });
    const sessJson = await createSess.json();
    out.createSession = sessJson;
    const sessionToken = sessJson.sessionToken;

    // login learner
    const lLogin = await login('learner@example.com','learn123');
    out.learnerLogin = lLogin;
    if(!lLogin.token) throw new Error('learner login failed');

    // learner join
    const joinRes = await fetch(backend + '/api/classroom/session/join', { method: 'POST', headers: { 'content-type':'application/json', Authorization: 'Bearer '+lLogin.token }, body: JSON.stringify({ classId: cls.id, sessionToken }) });
    out.join = await joinRes.json();

    // learner post chat
    const chat1 = await fetch(backend + `/api/classroom/${cls.id}/chat`, { method: 'POST', headers: { 'content-type':'application/json', Authorization: 'Bearer '+lLogin.token }, body: JSON.stringify({ sessionToken, text: 'Hello from learner (e2e)' }) });
    out.chat1 = await chat1.json();

    // teacher post chat
    const chat2 = await fetch(backend + `/api/classroom/${cls.id}/chat`, { method: 'POST', headers: { 'content-type':'application/json', Authorization: 'Bearer '+tLogin.token }, body: JSON.stringify({ sessionToken, text: 'Hello from teacher (e2e)' }) });
    out.chat2 = await chat2.json();

    // fetch chat history
    const chats = await fetch(backend + `/api/classroom/${cls.id}/chat?sessionToken=${sessionToken}` , { headers: { Authorization: 'Bearer '+tLogin.token } });
    out.history = await chats.json();

    // add resource via teacher
    const resAdd = await fetch(backend + `/api/classroom/${cls.id}/resources`, { method: 'POST', headers: { 'content-type':'application/json', Authorization: 'Bearer '+tLogin.token }, body: JSON.stringify({ title: 'E2E Slide', type: 'pdf', url: 'https://example.com/slide.pdf', description: 'Test slide' }) });
    out.addedResource = await resAdd.json();

    // list resources
    const resList = await fetch(backend + `/api/classroom/${cls.id}/resources`, { headers: { Authorization: 'Bearer '+tLogin.token } });
    out.resources = await resList.json();

    fs.writeFileSync('.temp_e2e_out.json', JSON.stringify(out, null, 2));
    console.log('WROTE .temp_e2e_out.json');
  }catch(err){
    console.error('E2E ERR', err);
    fs.writeFileSync('.temp_e2e_out.json', JSON.stringify({ error: String(err) }, null, 2));
  }
})();
