import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Circle = styled.div`
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  border-radius: 100%;
  justify-content: center;
  border: 2px solid ${COLOR.AZUL};

  @media only screen and (max-width: 767px) {
    width: 210px;
    height: 210px;
  }
`;

export default Circle;
