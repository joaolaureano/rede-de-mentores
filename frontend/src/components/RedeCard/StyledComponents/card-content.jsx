import styled from 'styled-components';
import COLORS from '../../../utils/colors.constants';

const CardContent = styled.div`
display:flex;
width: 60%;
height:210px;
flex-direction:column;
padding:0px 20px 0px 20px;
font-weight: 600;
color:${COLORS.AZUL};
@media screen and (max-width:1000px){
  height:auto;
  width:90%;
  padding:0px;
  margin-bottom: 10px;
  margin-top:10px;
}
`;
export default CardContent;
