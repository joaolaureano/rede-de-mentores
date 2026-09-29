import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import { shade } from 'polished';

import COLOR from '../../../utils/colors.constants';


const ContainerIcon = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  .icon {
    padding: 0px;
    margin-bottom: 50px;
    border-radius: 50%;
    transition: 0.4s;
    cursor: pointer;
    &:hover {
      transform: translateX(2px);
    }
  }
  
  
  svg{
    color: ${COLOR.VERDE_ESCURO};
    &:hover {
      color: ${shade(0.2, COLOR.VERDE_ESCURO)};
    }
  }
  
  svg + svg {
    color: ${COLOR.VERMELHO};
    &:hover {
      color: ${shade(0.2, COLOR.VERMELHO)};
    }
  }
  
  svg{
     cursor: pointer;  
  }
  
  div {
    box-sizing: border-box;
    padding: 10px;
    /* background: #d3d3; */
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 0px;
  }
`;

export default ContainerIcon;
