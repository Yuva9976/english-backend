(async()=>{
  try{
    const { sequelize, Classroom, ClassSession, ClassParticipant, ChatMessage, ClassResource } = require('./models');
    await sequelize.authenticate();
    console.log('DB OK');
    const classId = 1;
    const cls = await Classroom.findByPk(classId);
    console.log('CLASS:', cls && { id: cls.id, title: cls.title, teacher_id: cls.teacher_id } || null);
    const sessions = await ClassSession.findAll({ where: { class_id: classId }, order: [['created_at','DESC']], limit: 5 });
    console.log('SESSIONS:', sessions.map(s=>({ id: s.id, token: s.session_token, started_at: s.started_at, ended_at: s.ended_at })));
    const parts = await ClassParticipant.findAll({ where: { class_id: classId }, order: [['joined_at','DESC']], limit: 10 });
    console.log('PARTICIPANTS:', parts.map(p=>({ id: p.id, user_id: p.user_id, role: p.role, joined_at: p.joined_at, left_at: p.left_at })));
    const chats = await ChatMessage.findAll({ where: { class_id: classId }, order: [['created_at','ASC']], limit: 50 });
    console.log('CHATS:', chats.map(c=>({ id: c.id, user_id: c.user_id, user_name: c.user_name, text: c.text, createdAt: c.createdAt })));
    const resources = await ClassResource.findAll({ where: { class_id: classId }, order: [['created_at','DESC']] });
    console.log('RESOURCES:', resources.map(r=>({ id: r.id, title: r.title, url: r.url, created_by: r.created_by })));
  }catch(err){
    console.error('ERR', err);
    process.exit(1);
  }
})();
