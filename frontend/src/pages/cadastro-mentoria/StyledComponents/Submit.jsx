import styled from 'styled-components';

const Submit = styled.div`
  margin:0 auto;
  width:85%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;
    margin: 10px 0;
  }
`;

export default Submit;
