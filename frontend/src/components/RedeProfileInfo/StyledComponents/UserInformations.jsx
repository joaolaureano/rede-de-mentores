import styled from 'styled-components';

const UserInformations = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  margin-left: 15px;
  align-self: center;
  flex-direction: column;
  justify-content: center;

  @media screen and (max-width: 1024px) {
    margin: 0;
    align-items: center;
  }
`;

export default UserInformations;
