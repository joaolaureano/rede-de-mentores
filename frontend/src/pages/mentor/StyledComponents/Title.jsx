import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Title = styled.h1`
  color: ${COLOR.AZUL};
  font-size: 2rem;
  font-weight: 600;
  font-family: Roboto, sans-serif;

  @media screen and (max-width: 1024px) {
    text-align: Center;
  }
`;

export default Title;
