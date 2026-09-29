import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Container } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import StyledContainer from './StyledComponents';
import Card from '../../components/RedeCard/RedeCard';
import ModalRep from '../adm/StyledComponents/ModalReprove';
import { mentoriasByMentor, desativarMentoria, mudarVisibilidade } from '../../services/mentoria';
import { profile } from '../../services/user';
import RedeButton from '../../components/RedeButton/RedeButton';
import { userTypes } from '../../utils/userType.constants';

function Mentor() {
  const history = useHistory();
  const [flagModalRep, setFlagModalRep] = useState(false);
  const [mentoringId, setMentoringId] = useState('');
  const [mentorias, setMentorias] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const changeAvailability = () => {
    const token = sessionStorage.getItem('token');
    const id = mentoringId;
    const config = {
      params: { id },
      headers: { Authorization: `Bearer ${token}` },
    };

    desativarMentoria(config)
      .then(() => {
        setMentorias(mentorias.filter((el) => el.id !== id));
        enqueueSnackbar('Mentoria deletada!', { variant: 'success', autoHideDuration: 2500 });
        // eslint-disable-next-line no-use-before-define
        fechaModalRep();
      })
      .catch(() => {
        enqueueSnackbar(
          'Falha ao deletar essa mentoria. Verifique sua conexão e tente novamente.',
          { variant: 'error', autoHideDuration: 2500 },
        );
      });
  };

  const changeVisibility = (i) => {
    const allMentorias = [...mentorias];
    const token = sessionStorage.getItem('token');
    const { id } = mentorias[i];
    const config = {
      params: { id },
      headers: { Authorization: `Bearer ${token}` },
    };
    mudarVisibilidade(config).then(
      () => {
        allMentorias[i].data.isVisible = !allMentorias[i].data.isVisible;
        setMentorias(allMentorias);
        let message;
        if (allMentorias[i].data.isVisible) message = 'Mentoria está disponível para os mentorandos!';
        else message = 'Mentoria não está mais disponível para os mentorandos!';
        enqueueSnackbar(message, { variant: 'success', autoHideDuration: 2500 });
      },
    ).catch(
      () => {
        enqueueSnackbar(
          'Falha ao atualizar essa mentoria. Verifique sua conexão e tente novamente.',
          { variant: 'error', autoHideDuration: 2500 },
        );
      },

    );
  };

  const editPage = (mentoria) => {
    sessionStorage.setItem('oldMentoria', JSON.stringify(mentoria));
    history.push('/cadastro-mentoria');
  };

  const routeCadastro = () => {
    sessionStorage.removeItem('oldMentoria');
    history.push('/cadastro-mentoria');
  };

  useEffect(() => { // didMount
    function fetchData() {
      const token = sessionStorage.getItem('token');
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      profile(headers)
        .then((resp) => {
          if (resp.data.userType === userTypes.MENTORADO) {
            history.push('/mentorado');
          }
        })
        .catch(() => {
          enqueueSnackbar(
            'Problema ao buscar informações do usuário. Verifique sua conexão e tente novamente.',
            { variant: 'error', autoHideDuration: 2500 },
          );
          history.push('/');
        });
    }

    function fetchCards() {
      const token = sessionStorage.getItem('token');
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      mentoriasByMentor(headers)
        .then((res) => {
          if (res.data.length === 0) {
            setMentorias(
              <StyledContainer.Subtitle>Nenhuma mentoria encontrada!</StyledContainer.Subtitle>,
            );
          } else {
            setMentorias(res.data);
          }
        })
        .catch((erro) => {
          enqueueSnackbar(erro.response.data.error, { variant: 'error', autoHideDuration: 3000 });
          setMentorias(
            <StyledContainer.Subtitle>Nenhuma mentoria encontrada!</StyledContainer.Subtitle>,
          );
        });
    }
    fetchData();
    fetchCards();
  }, []);

  // eslint-disable-next-line no-shadow
  function abreModalRep(mentoriaId) {
    setMentoringId(mentoriaId);
    setFlagModalRep(true);
  }

  function fechaModalRep() {
    setFlagModalRep(false);
  }

  return (
    <>
      <Container>
        <StyledContainer>
          <StyledContainer.HeaderPage>
            <StyledContainer.Title> MINHAS MENTORIAS </StyledContainer.Title>
            <RedeButton onClick={routeCadastro} descricao="+ NOVA MENTORIA" />
          </StyledContainer.HeaderPage>
          {mentorias.length > 0 ? (
            mentorias.map((mentoria, i) => (
              <Card
                key={mentoria.id}
                mentoria={mentoria.data}
                onClickRemove={() => abreModalRep(mentoria.id)}
                onClickVisible={() => changeVisibility(i)}
                onClickEdit={() => editPage(mentoria)}
                isVisible={mentoria.data.isVisible}
                todosHorarios
              />
            ))
          ) : (<StyledContainer.Subtitle>Nenhuma mentoria encontrada!</StyledContainer.Subtitle>)}
          <ModalRep
            open={flagModalRep}
            handleClose={() => fechaModalRep()}
            evaluateMentoring={() => changeAvailability()}
          />
        </StyledContainer>
      </Container>
    </>
  );
}

export default Mentor;
