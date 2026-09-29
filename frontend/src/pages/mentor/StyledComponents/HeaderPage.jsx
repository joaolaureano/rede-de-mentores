import styled from 'styled-components';

const HeaderPage = styled.div`
  width: 90%;
  display: flex;
  margin-top: 30px;
  flex-direction: row;
  margin-bottom: 21px;
  justify-content: space-between;

  @media screen and (max-width: 1024px) {
    width: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
`;

export default HeaderPage;
