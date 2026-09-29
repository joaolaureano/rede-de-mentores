import styled from 'styled-components';

const CaminhoAp = styled.div`
  display: flex;
  justify-content: flex-start;
  align-self: stretch;
  margin-left: 250px;
  margin-top:0;
  padding-bottom: 10px;  

  @media only screen and (max-width: 768px) {
      margin-left: 0px;
      padding: 10px 15px;
  }
`;

export default CaminhoAp;
