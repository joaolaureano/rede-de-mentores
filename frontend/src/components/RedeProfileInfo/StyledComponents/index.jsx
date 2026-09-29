import styled from 'styled-components';
import COLORS from '../../../utils/colors.constants';

import Logo from './Logo';
import Bottom from './Bottom';
import UserName from './UserName';
import UserInformations from './UserInformations';

const Container = styled.div`
  display: flex;
  width: 755px;
  height: auto;
  max-width: 755px;
  min-height: 165px;
  padding-left: 35px;
  border-radius: 10px;
  color: ${COLORS.AZUL};
  border: 3px solid ${COLORS.AZUL};

  img {
    align-self: center;
  }

  @media screen and (max-width: 1024px) {
    width: 80%;
    height: auto;
    height: 220px;
    padding-left: 0px;
    padding-top: 20px;
    flex-direction: column;
  }
`;

Container.Logo = Logo;
Container.Bottom = Bottom;
Container.UserName = UserName;
Container.UserInformations = UserInformations;

export default Container;
