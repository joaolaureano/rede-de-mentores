import { css } from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Cancelar = css`
  color: ${COLOR.AZUL};
  background-color: ${COLOR.BRANCO};
  border: solid 1px ${COLOR.AZUL};

  :hover {
    color: ${COLOR.BRANCO};
    background-color: ${COLOR.AZUL};
    box-shadow: 0 0 15px ${COLOR.AZUL};
  }
`;

export default Cancelar;
