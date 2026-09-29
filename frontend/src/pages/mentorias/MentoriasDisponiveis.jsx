import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import Card from '../../components/RedeCard/RedeCard';
import Caminho from './StyledComponents/Caminho';
import Container from './StyledComponents';
// import { urlFiles } from '../../services/http';
import CaminhoTitle from './StyledComponents/CaminhoTitle';
import CaminhoTitleDesabilitado from './StyledComponents/CaminhoTitleDesabilitado';
import CaminhoAp from './StyledComponents/CaminhoAp';
import { mentoriasByMentorado } from '../../services/mentorado';
import RedeInputSearch from '../../components/RedeInputSearch/RedeInputSearch';

function MentoriasDisponiveis() {
  const [cards, setCards] = useState('');
  const areaConhecimento = sessionStorage.getItem('areaSelected');
  const [mentorias, setMentorias] = useState([]);
  const [redirectTo, setRedirectTo] = useState('');
  const history = useHistory();

  function mentoriaSelected(mentoria, e) {
    e.preventDefault();
    sessionStorage.setItem('mentoriaSelected', JSON.stringify(mentoria));
    history.push('/mentoria');
  }

  function generateCards(mentoriasAreaConhecimento) {
    const cardsMentorias = mentoriasAreaConhecimento
      .map((mentoria) => (
        <Card
          key={mentoria.idMentoria}
          mentoria={mentoria}
          onClickSchedule={(e) => mentoriaSelected(mentoria, e)}
          mentorias
        />
      ));
    setCards(cardsMentorias);
  }

  function filterMentorias(arrayMentoriasAll) {
    const mentoriasAreaConhecimento = arrayMentoriasAll
      .filter((e) => e.knowledgeArea === areaConhecimento);
    setMentorias(mentoriasAreaConhecimento);
    generateCards(mentoriasAreaConhecimento);
  }

  function getMentorias(headers) {
    mentoriasByMentorado(headers)
      .then((res) => {
        if (res.status === 200) {
          filterMentorias(res.data);
        }
      })
      .catch((err) => {
        setCards('Nenhuma mentoria encontrada para a Área de Conhecimento selecionada.');
        console.error(err);
      });
  }

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    getMentorias(headers);
  }, []);

  function attemptSearch(event) {
    const searchCards = mentorias
      .filter((e) => (e.title.toLowerCase().indexOf(event.toLowerCase()) !== -1));
    generateCards(searchCards);
  }

  return (redirectTo) ? <Redirect to={redirectTo} /> : (
    <Container>
      <CaminhoAp>
        <CaminhoTitleDesabilitado onClick={() => setRedirectTo('/mentorado')}>Home</CaminhoTitleDesabilitado>
        <Caminho />
        <CaminhoTitle>{areaConhecimento}</CaminhoTitle>
      </CaminhoAp>
      <RedeInputSearch placeholder="Procurar por Mentoria" onChange={(e) => attemptSearch(e.target.value)} />
      <Container.Title>MENTORIAS DISPONÍVEIS</Container.Title>
      <br />
      {cards}
    </Container>
  );
}

export default MentoriasDisponiveis;
