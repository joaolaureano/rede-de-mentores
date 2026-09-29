import styled from 'styled-components';

import Label from './Label';

const TextField = styled.div`
  display: flex;
  flex-direction: column;
`;

TextField.displayName = 'TextField';

TextField.Label = Label;

export default TextField;
