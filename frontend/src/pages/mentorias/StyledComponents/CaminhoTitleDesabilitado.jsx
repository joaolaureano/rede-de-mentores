import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Desabilitado = styled.h2`
  text-align: center;
  color: ${COLOR.CINZA};
  font-weight: bold;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  
  &:hover {
    color: ${COLOR.AZUL_CLARO};
    background-color: transparent;
    
  }
`;

export default Desabilitado;
