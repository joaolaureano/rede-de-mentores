import styled from 'styled-components';

const Container = styled.div`
  width: unset;
  height: ${(props) => props.height || 'initial'};
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify || 'space-evenly'};
  flex-direction: column;
`;

export default Container;
