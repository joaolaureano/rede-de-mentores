import styled from 'styled-components';
import DivSelectLabels from './DivSelectLabels';

const DivSelect = styled.div`
  display: flex;
  padding: 10px 0px;
  flex-direction: column;
  align-items: baseline;
  align-content: center;
   
`;

DivSelect.Labels = DivSelectLabels;

export default DivSelect;
