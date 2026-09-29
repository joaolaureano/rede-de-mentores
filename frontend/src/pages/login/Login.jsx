import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import logo from '../../assets/logo.png';
import Container from './StyledComponents';
import { login, profile, esqueceuSenha } from '../../services/user';
import RedeButton from '../../components/RedeButton/RedeButton';
import RedeSeparator from '../../components/RedeSeparator/RedeSeparator';
import RedeTextField from '../../components/RedeTextField/RedeTextField';
import pushIfNecessary from '../../utils/HTMLUtils';
import RedeForgotEmail from '../../components/RedeForgotEmail/RedeForgotEmail';

function Login() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { // componentDidMount
    sessionStorage.removeItem('headerTitle');
    const tkn = sessionStorage.getItem('token');
    if (tkn) {
      profile({ headers: { Authorization: `Bearer ${tkn}` } }).then((resp) => {
        pushIfNecessary(
          resp.data.userType,
          (link) => history.push(link),
        );
      });
    }
    // eslint-disable-next-line
  }, []);

  const attemptLogin = (event) => {
    setLoading(true);
    event.preventDefault();
    const data = {
      email,
      password,
    };

    if (!data.email || !data.password) {
      enqueueSnackbar('Preencha os campos de email e senha.', { variant: 'error', autoHideDuration: 2500 });
    } else {
      login(data)
        .then((res) => {
          if (res.status === 200) {
            sessionStorage.setItem('token', res.data.token);
            pushIfNecessary(
              res.data.result.userType,
              (link) => history.push(link),
            );
          }
        })
        .catch((err) => {
          enqueueSnackbar('Acesso não autorizado. Verifique seu email e sua senha.', { variant: 'error', autoHideDuration: 2500 });
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const sendForgotRequest = (data) => {
    setLoadingForgot(true);
    esqueceuSenha(data)
      .then((resp) => {
        if (resp.status === 200) {
          enqueueSnackbar(resp.data, { variant: 'success', autoHideDuration: 3000 });
        }
      })
      .catch((error) => {
        enqueueSnackbar(error.response.data, { variant: 'error', autoHideDuration: 3000 });
      }).finally(() => {
        setLoadingForgot(false);
      });
  };

  return (
    <Container>
      <RedeForgotEmail
        email={email}
        onChangeEmail={(evt) => setEmail(evt.target.value)}
        opened={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onConfirm={sendForgotRequest}
      />
      <Container.SideImage />
      <Container.SideLogin>
        <Container.Logo src={logo} />
        <Container.Form>
          <RedeTextField descricao="Email" valor={email} onChange={(evt) => setEmail(evt.target.value)} />
          <RedeTextField
            descricao="Senha"
            tipo="password"
            valor={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
          <Container.ForgotPassword onClick={() => {
            if (!loadingForgot) setForgotOpen(true);
          }}
          >
            Esqueci minha senha
          </Container.ForgotPassword>
          <RedeButton descricao="Entrar" onClick={attemptLogin} loading={loading} />
          <RedeSeparator descricao="Novo na Rede ?"> </RedeSeparator>
          <Link to="/register">
            <RedeButton descricao="Cadastrar" />
          </Link>
        </Container.Form>
      </Container.SideLogin>
    </Container>
  );
}

export default Login;
