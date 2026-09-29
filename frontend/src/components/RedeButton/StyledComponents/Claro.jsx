import { css } from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Claro = css`
  width: 150px;
  height: 30px;
  color: ${COLOR.AZUL};
  background-color: ${COLOR.AZUL_CLARO};

  :hover {
    box-shadow: 0 0 15px ${COLOR.AZUL_CLARO};
  }
`;

export default Claro;
