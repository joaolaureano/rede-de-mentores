import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Separator = styled.hr`
  height: 350px;
  border: 4px solid ${COLOR.AZUL_CLARO};
  border-radius: 5px;
  margin-left: 6vw;
  margin-right: 6vw;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 0px;

  @media (max-width: 767px) {
    display: none;
  }
`;

export default Separator;
