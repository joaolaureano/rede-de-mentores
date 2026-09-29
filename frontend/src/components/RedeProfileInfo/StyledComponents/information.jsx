import styled from 'styled-components';

import InformationName from './InformationName';
import RedeIcon from '../../RedeIcon/RedeIcon';

const Information = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;

  img {
    width: 32px;
    height: 32px;
  }

  @media screen and (max-width: 1024px) {
    margin-left: 0;
  }
`;

Information.Icon = RedeIcon;
Information.Name = InformationName;

export default Information;
