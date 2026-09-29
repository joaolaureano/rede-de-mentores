import styled from 'styled-components';
import searchImage from '../../../assets/search.png';
import COLOR from '../../../utils/colors.constants';

const Input = styled.input`
  width: 600px;
  height: 30px;
  outline: none;
  font-size: 1rem;
  margin: 10px auto;
  padding: 5px 20px;
  border-radius: 10px;
  background-size: 30px;
  background-repeat: no-repeat;
  background-position: 98% 50%;
  border: 2px solid ${COLOR.AZUL};
  background-image: url(${searchImage});

  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;

export default Input;
