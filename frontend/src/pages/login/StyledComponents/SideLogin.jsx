import styled from 'styled-components';

const SideLogin = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  box-sizing: border-box;
  box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.6);
  border-radius: 15px;
  padding: 15px 25px 50px;
  background-color: rgba(255, 255, 255, 0.8);

  @media screen and (max-width: 425px) {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    border-radius: 0;
  }
`;

export default SideLogin;
