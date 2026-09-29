import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as users from '../../repositories/userRepository';
import jwtAuth from '../../configs/jwt/auth';

module.exports = {
  async login(request, response) {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response
          .status(404)
          .json({ error: 'Não foram enviados os dados.' });
      }
      let result = null;
      let id = null;
      const user = await users.findByEmail(email);
      if (user) {
        result = user.data;
        id = user.id;
      }

      if (!result) {
        return response.status(401).json({ error: 'Usuário inválido!' });
      }
      if (!(await bcrypt.compare(password, result.password))) {
        return response.status(401).json({ error: 'Senha incorreta' });
      }

      // o hash da senha nao sai do servidor
      result = { ...result };
      delete result.password;

      return response.status(200).json({
        result,
        token: jwt.sign(
          {
            cpf: result.cpf,
            email: result.email,
            id,
            userType: result.userType,
          },
          jwtAuth.secret,
          {
            expiresIn: jwtAuth.expiresIn,
          }
        ),
      });
    } catch (e) {
      return response.status(500).json({
        error: `Erro durante o processamento do login. Espere um momento e tente novamente! Erro : ${e}`,
      });
    }
  },
};
