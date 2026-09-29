import styled from 'styled-components';

import Separator from './Separator';
import Title from './Title';

const Container = styled.div`
  display: flex;
  margin: 10px 0;
  justify-content: space-evenly;
`;

Container.displayName = 'Container';

Container.Separator = Separator;
Container.Title = Title;

export default Container;
