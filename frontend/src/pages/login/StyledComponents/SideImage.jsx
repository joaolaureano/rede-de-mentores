import styled from 'styled-components';

import logo from '../../../assets/idear2.png';

const SideImage = styled.div`
  opacity: 0.7;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center right;
  background-image: url(${logo});

  /* @media screen and (max-width: 1200px) { */
    /* display: none; */
    /* background-image: none; */
  /* } */
`;

export default SideImage;
