import styled from "styled-components";

import Title from "./Title";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px 15px;
  margin: 0 auto;

  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 0px;
  }
`;

Container.Title = Title;

export default Container;
