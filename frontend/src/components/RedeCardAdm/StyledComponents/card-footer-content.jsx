import styled from 'styled-components';
import IconsWrapper from './icons-wrapper';

const CardFooterContent = styled.div`
display:flex;
flex-direction:row;
justify-content:space-between;
align-items:center;

@media screen and (max-width:1000px){
  flex-direction:column;
  justify-content:space-between;
  ${IconsWrapper} {
    justify-content:space-around;
  }
}
`;
export default CardFooterContent;
