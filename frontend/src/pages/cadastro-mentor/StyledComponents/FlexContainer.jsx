import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-direction:row;
  justify-content: center;
  /*width:100%;
  height:100%; */

  @media (min-width: 767px) and (max-width: 1200px) {
  }
  @media (max-width: 767px) {
    flex-direction:column;
  }
`;

export default FlexContainer;
