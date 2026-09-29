import styled from 'styled-components';

import Logo from './logo';
import Form from './Form';
import SideImage from './SideImage';
import SideLogin from './SideLogin';
import ForgotPassword from './ForgotPassword';

const Container = styled.div`
  margin: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  text-align: left;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

Container.Logo = Logo;
Container.Form = Form;
Container.SideLogin = SideLogin;
Container.SideImage = SideImage;
Container.ForgotPassword = ForgotPassword;

export default Container;
