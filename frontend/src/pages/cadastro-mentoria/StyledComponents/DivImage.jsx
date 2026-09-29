import styled from 'styled-components';

const Img = styled.img`
  height: 80px;
  width: 100px;
  border: 1px solid #000;
  border-radius: 5px;
`;


const DivImage = styled.div`
  display: ${(props) => (props.image === '' ? 'none' : 'block')} 
`;

DivImage.Img = Img;

export default DivImage;
