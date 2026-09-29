import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  
  @media (min-width: 768px) and (max-width: 1199px) {
    justify-content: center;
  }
  @media (max-width: 767px) {
    justify-content: center;

  }
`;

export default Container;