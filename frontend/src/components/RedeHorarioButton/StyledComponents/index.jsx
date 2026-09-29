import styled from 'styled-components';
import Desabilitado from './Desabilitado';
import Ocupado from './Ocupado';
import COLOR from '../../../utils/colors.constants';

const HorarioButton = styled.button`
  display: flex;
  padding: 5px 25px;
  color: ${COLOR.AZUL};
  background-color: ${COLOR.AZUL_CLARO};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.4s ease, border 0.4s ease;
  border: 1px solid ${COLOR.AZUL_CLARO};
  font-weight: 700;

  :hover{
    background-color: #c4e4ff;
  }

  :focus{
    border: 1px solid #83a8c7;
    outline: none;
  }

  :active{
    background-color: #83a8c7;
  }

  ${({ disabled }) => disabled && Desabilitado}
  ${({ ocupado }) => ocupado && Ocupado}
`;

export default HorarioButton;
