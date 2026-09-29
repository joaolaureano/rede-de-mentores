import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Title = styled.h1`
  margin: 30px 0;
  font-size: 1.8rem;
  text-align: center;
  color: ${COLOR.AZUL};

  @media only screen and (max-width: 767px) {
    font-size: 1rem;
    margin: 15px 20px;
  }
`;

export default Title;
