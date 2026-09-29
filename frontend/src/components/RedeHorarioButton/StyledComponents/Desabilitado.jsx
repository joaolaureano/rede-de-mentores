import { css } from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Desabilitado = css`
  background-color: ${COLOR.CINZA};
  color: ${COLOR.CINZA_ESCURO};
  border-color: ${COLOR.CINZA};

  :hover {
    cursor: default !important;
    background-color: ${COLOR.CINZA};
    border-color: ${COLOR.CINZA};
    box-shadow: none !important;
  }

  :focus{
    border: 1px solid ${COLOR.CINZA};
    outline: none;
  }
`;

export default Desabilitado;
