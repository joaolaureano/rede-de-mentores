// Popula o banco com dados de demonstracao (portfolio): areas, mentores,
// mentorados, mentorias aprovadas/pendentes e alguns horarios ja reservados.
// Uso: DB_URL=... [FILES_BUCKET=...] npm run seed -- --reset [--admin-email e --admin-password]
// --reset apaga TODOS os dados antes; sem ele o seed so roda em banco vazio.
// As datas das mentorias sao relativas a hoje (proximas 4 semanas): rodar de
// novo renova a vitrine.
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import { query } from '../src/configs/database/connection';
import { newUploadKey, putUpload, resizedName } from '../src/helper/imageStorage';
import getNextDateTime from '../src/helper/getNextDateTimeHelper';
import * as users from '../src/repositories/userRepository';
import * as mentorias from '../src/repositories/mentoriaRepository';
import * as areas from '../src/repositories/areaRepository';

const args = process.argv.slice(2);
const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

// Contas publicas da vitrine: senha conhecida de proposito. O admin nao e
// publico (quem tiver a senha dele pode apagar tudo).
const DEMO_PASSWORD = 'demo1234';
const DEMO_MENTOR = 'mentor@demo.rededementores.dev';
const DEMO_MENTEE = 'mentorado@demo.rededementores.dev';

const AREAS = ['Tecnologia', 'Carreira', 'Empreendedorismo', 'Design', 'Dados', 'Marketing', 'Finanças', 'Liderança'];
const PALETTE = [['#4f46e5', '#06b6d4'], ['#db2777', '#f59e0b'], ['#059669', '#84cc16'], ['#7c3aed', '#ec4899'], ['#0369a1', '#22d3ee'], ['#b45309', '#f97316'], ['#be123c', '#fb7185'], ['#1d4ed8', '#a78bfa']];

// cpf/telefone ficticios e obviamente de demonstracao
const MENTORS = [
  { name: 'Ana Ribeiro', email: DEMO_MENTOR, areas: ['Tecnologia', 'Carreira'] },
  { name: 'Bruno Carvalho', areas: ['Dados', 'Tecnologia'] },
  { name: 'Carla Menezes', areas: ['Design', 'Marketing'] },
  { name: 'Diego Fontana', areas: ['Empreendedorismo', 'Finanças'] },
  { name: 'Elisa Prado', areas: ['Liderança', 'Carreira'] },
  { name: 'Felipe Moraes', areas: ['Tecnologia'] },
  { name: 'Gabriela Lins', areas: ['Marketing', 'Empreendedorismo'] },
  { name: 'Henrique Dias', areas: ['Finanças', 'Dados'] },
];
const MENTEES = [
  { name: 'Marina Costa', email: DEMO_MENTEE, registration: '20231001' },
  { name: 'Lucas Teixeira', registration: '20231002' },
  { name: 'Paula Nogueira', registration: '20231003' },
];

// [mentor, titulo, area, opcoes, dias, horas, descricao, aprovada]
const MENTORIAS = [
  [0, 'Primeiros passos em programação web', 'Tecnologia', ['Online'], ['Segunda', 'Quarta'], ['19:00', '19:00'], 'HTML, CSS e JavaScript do zero: como montar um roteiro de estudos e seu primeiro projeto publicado.', true],
  [0, 'Revisão de currículo para área de TI', 'Carreira', ['Online'], ['Quinta'], ['18:00'], 'Leitura do seu currículo e LinkedIn com foco em vagas de estágio e júnior em tecnologia.', true],
  [0, 'Preparação para entrevista técnica', 'Tecnologia', ['Online', 'Presencial'], ['Sexta'], ['10:00'], 'Simulação de entrevista com problemas de lógica e conversa sobre projetos.', false],
  [1, 'Introdução à análise de dados com Python', 'Dados', ['Online'], ['Terça', 'Quinta'], ['20:00', '20:00'], 'Pandas, visualização e como contar uma história com dados em um notebook.', true],
  [1, 'SQL na prática', 'Dados', ['Online'], ['Quarta'], ['14:00'], 'Consultas, junções e agregações a partir de um banco real de exemplo.', true],
  [2, 'Portfólio de UX/UI que chama atenção', 'Design', ['Online'], ['Segunda'], ['15:00'], 'Como escolher cases, mostrar processo e apresentar seu portfólio em 10 minutos.', true],
  [2, 'Identidade visual para pequenos negócios', 'Marketing', ['Presencial'], ['Quinta'], ['10:00'], 'Do briefing à marca: cores, tipografia e aplicações para redes sociais.', true],
  [3, 'Validando uma ideia de negócio', 'Empreendedorismo', ['Online', 'Presencial'], ['Terça'], ['09:00'], 'Entrevistas com clientes, MVP e métricas para decidir se vale continuar.', true],
  [3, 'Finanças para quem está começando a empreender', 'Finanças', ['Online'], ['Sexta'], ['16:00'], 'Fluxo de caixa, precificação e separação entre contas pessoais e da empresa.', true],
  [4, 'Liderando seu primeiro time', 'Liderança', ['Online'], ['Quarta'], ['18:00'], 'Feedback, 1:1 e como delegar sem perder o acompanhamento.', true],
  [4, 'Planejamento de carreira em 1 hora', 'Carreira', ['Online'], ['Segunda'], ['12:00'], 'Mapeamento de interesses e habilidades para traçar os próximos 12 meses.', true],
  [5, 'Git e GitHub sem medo', 'Tecnologia', ['Online'], ['Terça'], ['19:00'], 'Commits, branches e pull requests com um projeto de exemplo.', true],
  [6, 'Marketing digital com orçamento zero', 'Marketing', ['Online'], ['Quinta'], ['17:00'], 'Conteúdo orgânico, calendário editorial e métricas que importam.', false],
  [7, 'Organizando as finanças pessoais', 'Finanças', ['Online'], ['Sexta'], ['19:00'], 'Orçamento, reserva de emergência e primeiros investimentos.', true],
];

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('');
const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Imagens geradas (sem fotos de pessoas reais). Seguem o mesmo claim check do
// app: o original vai para uploads/ e o banco guarda o nome derivado do ticket;
// na nuvem a Lambda de resize produz files/<uuid>-resized.jpg.
const gradient = ([a, b], w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>${body}</svg>`);
const toFile = async (svg) => {
  const key = newUploadKey();
  await putUpload(key, await sharp(svg).jpeg().toBuffer());
  return resizedName(key);
};
const avatar = (name, colors) => toFile(gradient(colors, 500, 500, `<text x="50%" y="54%" font-family="Helvetica, Arial, sans-serif" font-size="200" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">${initials(name)}</text>`));
// o librsvg (sharp) nao renderiza foreignObject: quebra de linha manual
const wrap = (text, max) => text.split(' ').reduce((lines, word) => {
  const last = lines[lines.length - 1];
  if (last && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
  else lines.push(word);
  return lines;
}, []);
const cover = (title, area, colors) => toFile(gradient(colors, 1000, 560, `<text x="60" y="110" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#ffffffcc">${escapeXml(area)}</text>${wrap(title, 24).map((line, i) => `<text x="60" y="${210 + i * 78}" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#fff">${escapeXml(line)}</text>`).join('')}`));

const run = async () => {
  const { rows } = await query('SELECT (SELECT count(*) FROM users) + (SELECT count(*) FROM mentorias) AS n');
  if (Number(rows[0].n) > 0) {
    if (!args.includes('--reset')) throw new Error('banco nao esta vazio: use --reset para apagar tudo e recriar');
    await query('TRUNCATE users, mentorias, areas_conhecimento');
  }

  for (const name of AREAS) await areas.insert(name);

  const demoHash = await bcrypt.hash(DEMO_PASSWORD, 8);
  const adminEmail = arg('--admin-email') || 'admin@demo.rededementores.dev';
  const adminPassword = arg('--admin-password') || crypto.randomBytes(12).toString('base64url');
  await users.insert({ name: 'Administração', email: adminEmail, cpf: '90000000000', password: await bcrypt.hash(adminPassword, 8), userType: 0, areas: [] });

  const mentorCpfs = [];
  for (const [i, m] of MENTORS.entries()) {
    const cpf = `9000000${String(i + 1).padStart(4, '0')}`;
    const slug = m.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, '.');
    await users.insert({
      name: m.name, email: m.email || `${slug}@demo.rededementores.dev`, cpf, phone: `(51) 90000-${String(i + 1).padStart(4, '0')}`,
      linkedin: `linkedin.com/in/demo-rdm-${slug.replace('.', '-')}`, areas: m.areas, userType: 1,
      password: demoHash, image: await avatar(m.name, PALETTE[i % PALETTE.length]),
    });
    mentorCpfs.push(cpf);
  }

  const menteeCpfs = [];
  for (const [i, m] of MENTEES.entries()) {
    const cpf = `9100000${String(i + 1).padStart(4, '0')}`;
    const slug = m.name.toLowerCase().replace(/ /g, '.');
    await users.insert({
      name: m.name, email: m.email || `${slug}@demo.rededementores.dev`, cpf, phone: `(51) 91000-${String(i + 1).padStart(4, '0')}`,
      birthDate: `200${i + 1}-0${i + 3}-15`, registration: m.registration, userType: 2,
      password: demoHash, image: await avatar(m.name, PALETTE[(i + 4) % PALETTE.length]),
    });
    menteeCpfs.push(cpf);
  }

  let booked = 0;
  for (const [k, [mi, title, area, options, days, hours, description, approved]] of MENTORIAS.entries()) {
    const dateTime = await getNextDateTime([], days, hours);
    // reserva o 2o horario de algumas mentorias aprovadas: a vitrine mostra
    // horarios ocupados e livres, e a mentorada demo ja tem inscricoes
    if (approved && k % 3 === 0 && dateTime[1]) {
      Object.assign(dateTime[1].times[0], { flagBusy: true, mentoradoId: menteeCpfs[k % menteeCpfs.length], typeMentoring: options[0], descProject: 'Quero montar um plano de estudos para os próximos meses.' });
      booked += 1;
    }
    await mentorias.insert({
      cpf: mentorCpfs[mi], title, description, knowledgeArea: area, mentoringOption: options,
      dateTime, image: await cover(title, area, PALETTE[k % PALETTE.length]),
      flagDisable: false, isVisible: true, mentoringApproved: approved,
    });
  }

  return { adminEmail, adminPassword, booked };
};

run()
  .then(({ adminEmail, adminPassword, booked }) => {
    console.log(`seed ok: ${AREAS.length} areas, ${MENTORS.length} mentores, ${MENTEES.length} mentorados, ${MENTORIAS.length} mentorias (${booked} horarios reservados)`);
    console.log(`contas publicas (senha ${DEMO_PASSWORD}): ${DEMO_MENTOR} | ${DEMO_MENTEE}`);
    console.log(`admin (privado): ${adminEmail} / ${adminPassword}`);
    process.exit(0);
  })
  .catch((err) => { console.error('seed falhou:', err.message); process.exit(1); });
