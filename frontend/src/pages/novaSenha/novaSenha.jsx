import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams, useHistory } from 'react-router';
import { Container } from '@material-ui/core';
import { resetarSenha } from '../../services/user';
import StyledContainer from './StyledComponents';
import RedeTextField from '../../components/RedeTextField/RedeTextField';
import RedeButton from '../../components/RedeButton/RedeButton';
import Formulario from './StyledComponents/Formulario';

function NovaSenha() {
  const { id } = useParams();
  const [senha, setSenha] = useState();
  const [confirmarSenha, setConfirmarSenha] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const enqueue = (msg = '', variant = 'error', autoHideDuration = 2500) => {
    enqueueSnackbar(msg, { variant, autoHideDuration });
  };

  const handleNewPassword = (evt) => {
    if (evt) evt.preventDefault();
    resetarSenha({
      id,
      newPassword: senha,
    }).then(() => {
      enqueue('Senha alterada com sucesso!', 'success', 3000);
      history.push('/');
    }).catch((err) => {
      enqueue(err.response.data.message);
    });
  };

  return (
    <Container>
      <StyledContainer>
        <Formulario onSubmit={handleNewPassword}>
          <RedeTextField
            descricao="Nova Senha"
            valor={senha}
            onChange={(evt) => setSenha(evt.target.value)}
            tipo="password"
          />
          <RedeTextField
            descricao="Confirmar Nova Senha"
            valor={confirmarSenha}
            onChange={(evt) => setConfirmarSenha(evt.target.value)}
            tipo="password"
          />
          <RedeButton
            buttonProps={{ style: { width: '100%' } }}
            desabilitado={!senha || !confirmarSenha || senha !== confirmarSenha}
            descricao="ALTERAR SENHA"
            onClick={handleNewPassword}
          />
        </Formulario>

      </StyledContainer>
    </Container>
  );
}

export default NovaSenha;
