import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

import Logo from './logo';
import Title from './Title';
import Clearfix from './clearfix';
import ImgProfile from './imgProfile';

const Container = styled.div`
  opacity: 1;
  width: 100%;
  height: 70px;
  display: flex;
 
  align-items: center;
  justify-content: space-between;
  position: fixed;
  padding: 0 10px;
  left: 0;
  top: 0;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.5);
  background: ${COLOR.AZUL} 0% 0% no-repeat padding-box;
  z-index: 9;
  box-sizing: border-box;
`;

Container.Logo = Logo;
Container.ImgProfile = ImgProfile;
Container.Title = Title;
Container.Clearfix = Clearfix;

export default Container;
