import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Logo = styled.h2`
  color: ${COLOR.AZUL_CLARO};
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

export default Logo;
