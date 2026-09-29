import styled from 'styled-components';

import Title from './Title';
import Subtitle from './Subtitle';
import HeaderPage from './HeaderPage';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 33px;

  @media screen and (max-width: 1024px) {
    width: 100%;
  }
`;

Container.Title = Title;
Container.Subtitle = Subtitle;
Container.HeaderPage = HeaderPage;

export default Container;
