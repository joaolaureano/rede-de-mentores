import { css } from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Desabilitado = css`
  background-color: ${COLOR.CINZA};
  color: ${COLOR.BRANCO};

  &:hover {
    cursor: default !important;
    box-shadow: none !important;
  }
`;

export default Desabilitado;
