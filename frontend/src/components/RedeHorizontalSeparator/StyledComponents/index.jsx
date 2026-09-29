import styled from 'styled-components';

import Register from './Register';

import Separator from './Separator';

const Container = styled.div`
  ${({ isRegister }) => isRegister && Register}
`;

Container.displayName = 'Container';

Container.Separator = Separator;

export default Container;
