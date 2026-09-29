import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import Container from './StyledComponents';
import Caminho from '../mentorias/StyledComponents/Caminho';
import CaminhoTitle from '../mentorias/StyledComponents/CaminhoTitle';
import CaminhoTitleDesabilitado from '../mentorias/StyledComponents/CaminhoTitleDesabilitado';
import CaminhoAp from '../mentorias/StyledComponents/CaminhoAp';
import Card from '../../components/RedeCard/RedeCard';
import Title from './StyledComponents/Title';
import Titles from './StyledComponents/Titles';
import Subtitle from './StyledComponents/SubTitle';
import Legend from './StyledComponents/Legend';
import HeaderCard from './StyledComponents/HeaderCard';
import RedeHorarioCard from '../../components/RedeHorarioCard/RedeHorarioCard';
import RedeHorarioButton from '../../components/RedeHorarioButton/RedeHorarioButton';
import { buscarMentoria } from '../../services/mentoria';

function Mentoria() {
  const [redirectTo, setRedirectTo] = useState('');
  const [mentoria, setMentoria] = useState(null);
  const areaConhecimento = sessionStorage.getItem('areaSelected');

  useEffect(() => {
    async function fetchMentoria() {
      const token = sessionStorage.getItem('token');
      const { idMentoria } = JSON.parse(sessionStorage.getItem('mentoriaSelected'));
      await buscarMentoria({ headers: { Authorization: `Bearer ${token}`, id: idMentoria } }).then(
        (res) => {
          const helpObj = res.data;
          helpObj.idMentoria = res.data.id;
          setMentoria(helpObj);
        },
      ).catch(() => null);
    }
    fetchMentoria();
  }, []);
  console.log(mentoria);
  if (!mentoria) return null;
  return (redirectTo) ? (<Redirect to={redirectTo} />) : (
    <Container>
      <CaminhoAp>
        <CaminhoTitleDesabilitado onClick={() => setRedirectTo('/mentorado')}>Home</CaminhoTitleDesabilitado>
        <Caminho />
        <CaminhoTitleDesabilitado onClick={() => setRedirectTo('/mentorias-disponiveis')}>{areaConhecimento}</CaminhoTitleDesabilitado>
        <Caminho />
        <CaminhoTitle>{mentoria.title}</CaminhoTitle>
      </CaminhoAp>
      <Card
        mentoria={mentoria}
        mentorias
        todosHorarios
      />
      <HeaderCard>
        <Titles>
          <Title> Horários e Datas</Title>
          <Subtitle> Selecione um Horário disponível </Subtitle>
        </Titles>
        <Legend>
          <RedeHorarioButton horario="Disponível"> </RedeHorarioButton>
          <RedeHorarioButton ocupado desabilitado horario="Indisponível"> </RedeHorarioButton>
        </Legend>
      </HeaderCard>
      <RedeHorarioCard mentoria={mentoria} />
    </Container>
  );
}

export default Mentoria;
