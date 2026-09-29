import styled from 'styled-components';
import COLORS from '../../../utils/colors.constants';

const MentorName = styled.p`
  text-align: center;
  font-size: 1.0em;
  color: ${COLORS.AZUL};
  white-space: pre;

  @media only screen and (max-width: 768px) {
    padding: 0 5px 0 0;
    font-size: 1em;
  }
`;

export default MentorName;
