import styled from 'styled-components';
import Label from './Label';

const Container = styled.div`
  display: flex;
  align-items: center;
  &:not(:first-child){
   margin-left: 20px;
  }
`;

Container.Label = Label;

export default Container;
