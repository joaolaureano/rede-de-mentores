import styled from 'styled-components';
import CardFooterContent from './card-footer-content';
import SubTitle from './subtitle';

const CardFooter = styled.div`
  display:flex;
  width: 100%;
  flex-direction:column;

`;
CardFooter.SubTitle = SubTitle;
CardFooter.Content = CardFooterContent;

export default CardFooter;
