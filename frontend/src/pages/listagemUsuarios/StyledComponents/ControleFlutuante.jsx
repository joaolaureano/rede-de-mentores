import styled from 'styled-components';
import COLOR from '../../../utils/colors.constants';

const ControleFlutuante = styled.div`
  position: fixed;
  top: 80px;
  left: 12px;
  background-color: #FFFFFF;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 4px;

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{
    border-color: ${COLOR.AZUL};
  }
`;

export default ControleFlutuante;
