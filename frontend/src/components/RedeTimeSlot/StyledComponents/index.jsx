import styled from 'styled-components';

import Selecionado from  './Selecionado' 
import Deselecionado from './Deselecionado' 

const TimeSlot = styled.button`
  min-width: 110px;
  min-height: 40px;
  width: 30%;
  font-size: 0.9em;
  border-radius: 10px;
  font-weight: 600;
  :hover{
    cursor:pointer;
  }
  ${({ selecionado }) => selecionado && Selecionado}
  ${({ deselecionado }) => deselecionado && Deselecionado}

  `;

TimeSlot.displayName = 'TimeSlot';

export default TimeSlot;
