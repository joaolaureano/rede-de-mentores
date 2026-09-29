import { css } from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Ocupado = css`
  background-color: ${COLOR.CINZA_ESCURO};
  color: ${COLOR.AZUL};
  border-color: ${COLOR.CINZA_ESCURO};

  :hover {
    cursor: default !important;
    background-color: ${COLOR.CINZA_ESCURO};
    border-color: ${COLOR.CINZA_ESCURO};
    box-shadow: none !important;
  }

  :focus{
    border: 1px solid ${COLOR.CINZA_ESCURO};
    outline: none;
  }
`;

export default Ocupado;
