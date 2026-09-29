import styled from 'styled-components';

import Label from './Label';
import Input from './Input';

const TextField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

TextField.displayName = 'TextField';

TextField.Label = Label;
TextField.Input = Input;

export default TextField;
