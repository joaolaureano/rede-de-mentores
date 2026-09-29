import styled from 'styled-components';
import MsgAjuda from './MsgAjuda';
import Erro from './Erro';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  ${({ erro }) => erro && Erro}
`;

Container.MsgAjuda = MsgAjuda;

export default Container;
