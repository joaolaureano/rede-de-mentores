import styled from 'styled-components';
import Title from './title';
import RedeButton from '../../RedeButton/RedeButton';

const CardHeader = styled.div`
  display:flex;
  justify-content: space-between;
  width: 100%;
  align-items:center;
  @media screen and (max-width:1000px){
    button{
      display:none;
    }
  }
`;

CardHeader.Title = Title;
CardHeader.Button = RedeButton;
export default CardHeader;
