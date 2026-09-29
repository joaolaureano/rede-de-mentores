// Cria (ou promove) o usuario administrador (userType 0). A API so cadastra
// mentores e mentorados, entao o primeiro admin nasce por aqui.
// Uso: DB_URL=postgresql://... npm run create-admin -- <email> <senha> [nome]
import bcrypt from 'bcryptjs';
import * as users from '../src/repositories/userRepository';

const [email, password, name = 'Administrador'] = process.argv.slice(2);

const run = async () => {
  if (!email || !password) {
    throw new Error('uso: npm run create-admin -- <email> <senha> [nome]');
  }
  const hash = await bcrypt.hash(password, 8);
  const existing = await users.findByEmail(email);
  if (existing) {
    await users.update(existing.id, { userType: 0, password: hash });
    return `usuario ${email} promovido a admin`;
  }
  await users.insert({ email, password: hash, name, userType: 0, areas: [] });
  return `admin ${email} criado`;
};

run()
  .then((msg) => {
    console.log(msg);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
