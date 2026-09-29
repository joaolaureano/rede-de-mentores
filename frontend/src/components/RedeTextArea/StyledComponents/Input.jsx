import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Input = styled.textarea`
  outline: 0;
  width: 280px;
  font-size: 1rem;
  resize: vertical;
  padding: 4px 10px;
  border-radius: 5px;
  color: ${COLOR.AZUL};
  border: 1px solid ${COLOR.AZUL};
`;

export default Input;
