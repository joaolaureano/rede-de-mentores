import styled from 'styled-components';

const CardDescription = styled.p`
  font-size: 1em;
  line-height: 1.5em;
  max-width: 100%;
  display: block;
  max-height: 70px;
  height: 70px;
  overflow: hidden;
  width: auto;
  flex-direction: row;
  padding: 5px 0px 5px 0px;
  text-overflow: ellipsis;

  @media screen and (min-width: 499px) and (max-width: 1000px) {
    height: auto;
    max-height: 120px;
    overflow: hidden;
  }
  @media screen and (max-width: 499px) {
    height: auto;
    max-height: 120px;
    overflow: hidden;
  }
`;

export default CardDescription;
