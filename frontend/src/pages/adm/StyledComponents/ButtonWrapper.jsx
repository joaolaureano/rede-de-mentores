import styled from "styled-components";

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  place-content: center;

  width: 100%;

  position: relative;  
  button{
    margin-left:10px;
    margin-right:10px;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 0px;
  }
`;

export default ButtonWrapper;
