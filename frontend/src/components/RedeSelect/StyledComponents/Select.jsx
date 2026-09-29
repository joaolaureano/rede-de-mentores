import styled from 'styled-components';
import COLOR from '../../../utils/colors.constants';

const Select = styled.select`
  outline: 0;
  height: 30px;
  min-width: 290px;
  /*width: 100%; */
  color: ${COLOR.AZUL};
  font-size: 1rem;
  padding-left: 10px;
  border-radius: 5px;
  border: 1px solid ${COLOR.AZUL};
`;

export default Select;
