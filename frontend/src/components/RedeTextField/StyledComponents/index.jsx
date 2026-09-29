import styled from 'styled-components';

import Label from './Label';
import Input from './Input';
import MsgAjuda from './MsgAjuda';
import Erro from './Erro';

const TextField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;

  ${({ erro }) => erro && Erro}
`;

TextField.displayName = 'TextField';

TextField.Label = Label;
TextField.Input = Input;
TextField.MsgAjuda = MsgAjuda;

export default TextField;
