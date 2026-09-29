import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import RedeHeader from '../../components/RedeHeader/RedeHeader';
import Card from '../../components/RedeCardAdm/RedeCardAdm';
import Modal from './StyledComponents/Modal';
import ModalRep from './StyledComponents/ModalReprove';
import Container from './StyledComponents';
import Title2 from './StyledComponents/Title2';
import ContainerIcon from './StyledComponents/ContainerIcon';
import ContainerCards from './StyledComponents/ContainerCards';

import { urlFiles } from '../../services/http';
import { pendingMentorings, mentoringEvaluation } from '../../services/adm';
import { profile } from '../../services/user';
import { userTypes } from '../../utils/userType.constants';
import pushIfNecessary from '../../utils/HTMLUtils';

function Administrador() {
  const [cards, setCards] = useState('');
  const [flagModal, setFlagModal] = useState(false);
  const [flagModalRep, setFlagModalRep] = useState(false);
  const [mentoria, setMentoria] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    profile(headers)
      .then((resp) => {
        if (resp.data.userType !== userTypes.ADMINISTRADOR) {
          pushIfNecessary(
            resp.data.userType,
            (link) => history.push(link),
          );
        }
        // eslint-disable-next-line no-use-before-define
        getMentorias(headers);
      })
      .catch(() => {
        enqueueSnackbar(
          'Problema ao buscar informações do usuário. Verifique sua conexão e tente novamente.',
          { variant: 'error', autoHideDuration: 2500 },
        );
        history.push('/');
      });
  }, []);

  // eslint-disable-next-line no-shadow
  function evaluateMentoring(mentoria, flag) {
    const { id } = mentoria;
    const token = sessionStorage.getItem('token');
    const body = {};
    if (flag === 1) {
      body.title = newTitle;
      body.approved = true;
    }
    if (flag === 2) {
      body.title = mentoria.data.title;
      body.mentorEmail = mentoria.mentorInfo.email;
      body.approved = false;
    }

    const config = {
      param: id,
      headers: { Authorization: `Bearer ${token}` },
    };
    mentoringEvaluation(body, config)
      .then((res) => {
        if (res.status === 200) {
          // eslint-disable-next-line no-use-before-define
          getMentorias(config);
          setFlagModal(false);
          setFlagModalRep(false);
        }
      })
      .catch((err) => {
        if (flag === 1) {
          enqueueSnackbar('A mentoria não pôde ser aprovada!', { variant: 'error', autoHideDuration: 2500 });
        }
        if (flag === 2) {
          enqueueSnackbar('A mentoria não pôde ser reprovada!', { variant: 'error', autoHideDuration: 2500 });
        }
        console.log(err);
      });
  }

  function getMentorias(headers) {
    pendingMentorings(headers)
      .then((res) => {
        if (res.status === 200) {
          // eslint-disable-next-line no-use-before-define
          generateCards(res.data);
        }
      })
      .catch((err) => {
        setCards('Nenhuma mentoria encontrada para ser aprovada.');
        console.error(err);
      });
  }

  // eslint-disable-next-line no-shadow
  function abreModal(mentoria) {
    setMentoria(mentoria);
    setNewTitle(mentoria.data.title);
    setFlagModal(true);
  }

  function fechaModal() {
    setFlagModal(false);
  }

  // eslint-disable-next-line no-shadow
  function abreModalRep(mentoria) {
    setMentoria(mentoria);
    setFlagModalRep(true);
  }

  function fechaModalRep() {
    setFlagModalRep(false);
  }

  function generateCards(mentorias) {
    // eslint-disable-next-line no-shadow
    const cardsMentorias = mentorias.map((mentoria) => (
      <ContainerCards key={mentoria.id}>
        <Card
          title={mentoria.data.title}
          description={mentoria.data.description}
          image={`${urlFiles}/${mentoria.data.image}`}
          mentorName={mentoria.mentorInfo.name}
          mentorImage={`${urlFiles}/${mentoria.mentorInfo.image}`}
        />
        <div>
          <ContainerIcon>
            <AiOutlineCheckCircle
              size={45}
              className="icon"
              onClick={() => abreModal(mentoria)}
            />
            <AiOutlineCloseCircle
              size={45}
              className="icon"
              onClick={() => abreModalRep(mentoria)}
            />
          </ContainerIcon>
        </div>
      </ContainerCards>
    ));
    setCards(cardsMentorias);
  }

  return (
    <Container>
      <RedeHeader />
      <Container.Title>APROVAÇÕES PENDENTES</Container.Title>
      <Title2>
        {`Você tem ${cards.length} mentoria${cards.length !== 1 ? 's' : ''} para aprovar`}
      </Title2>
      <br />
      {cards}
      <Modal
        open={flagModal}
        handleClose={() => fechaModal()}
        editFunction={() => evaluateMentoring(mentoria, 1)}
        mentoriaTitle={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <ModalRep
        open={flagModalRep}
        handleClose={() => fechaModalRep()}
        evaluateMentoring={() => evaluateMentoring(mentoria, 2)}
      />
    </Container>
  );
}

export default Administrador;
