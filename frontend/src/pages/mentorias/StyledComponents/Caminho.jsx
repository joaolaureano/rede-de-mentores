import styled from 'styled-components';

import React from 'react';
import CAMINHO_ICON from '../../../assets/caminho.png';

const StyledCaminho = styled.img`
  background-repeat: no-repeat;
  width: 20px;
  height: 20px;
  text-align: inherit;
  position: relative;
  top: 5px;
  margin-right: 15px;
  margin-left: 15px;
`;

const Caminho = () => <StyledCaminho src={CAMINHO_ICON} />;

export default Caminho;
