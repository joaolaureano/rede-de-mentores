import styled from 'styled-components';

const Item = styled.div`
/*margin-left:5%;
margin-right:5%;
*/

@media (min-width: 768px) and (max-width: 1199px) {
  margin-left:0%;
}
@media (max-width: 767px) {
  /*margin-left:10%;*/
}
`;

export default Item;
