import styled from 'styled-components';
import COLOR from '../../../utils/colors.constants';

const Tabela = styled.table`
  border-collapse: collapse;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  user-select: none;
  margin-bottom: 80px;
  thead{
    background-color: ${COLOR.AZUL};
    color: #FFFFFF;
    tr > th{
      color: white;
      padding: 16px 8px;
    }
    tr > .select-cell {
      text-align: right;
    }
  }
  tbody{
    tr{
      transition: background-color 0.4s ease;
      &:nth-child(even){
        background-color: #EFEFEF;
      }
      &:hover{
        background-color: #DEDEDE;
      }
      td{
        padding: 16px;
      }
    }
  }
`;

export default Tabela;
