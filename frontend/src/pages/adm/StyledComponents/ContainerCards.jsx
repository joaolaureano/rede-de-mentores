import styled from "styled-components";

const ContainerCards = styled.div`
  display: flex;
  /* flex-direction: column; */
  align-items: center;

  place-content: center;

  width: 100%;

  position: relative;

  

  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 0px;
  }
`;

export default ContainerCards;
