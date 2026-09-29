import styled from 'styled-components';
import Desabilitado from './Desabilitado';
import Claro from './Claro';
import Loading from './Loading';
import Cancelar from './Cancelar';

import COLOR from '../../../utils/colors.constants';

const Button = styled.button`
  border: none;
  width: 250px;
  height: 40px;
  margin: 10px 0;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.3s;
  font-weight: 600;
  border-radius: 10px;
  color: ${COLOR.AZUL};
  background-color: ${COLOR.AMARELO};
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    box-shadow: 0 0 15px ${COLOR.AMARELO};
  }

  :focus {
    outline: none;
  }

  ${({ claro }) => claro && Claro}
  ${({ cancelar }) => cancelar && Cancelar}
  ${({ disabled }) => disabled && Desabilitado}
  ${({ loading }) => loading && Loading}
`;

Button.displayName = 'Button';

export default Button;
