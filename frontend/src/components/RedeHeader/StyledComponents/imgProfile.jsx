import styled from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const ImgProfile = styled.img`
  right: 10px;
  height: 50px;
  width: 50px;
  border-radius: 100%;
  border: 2px solid ${COLOR.AZUL};
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.4s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export default ImgProfile;
