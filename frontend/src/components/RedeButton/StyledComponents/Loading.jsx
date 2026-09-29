import { css } from 'styled-components';

import COLOR from '../../../utils/colors.constants';

const Loading = css`
  svg {
    animation: rotate infinite linear 0.5s;
    margin-right: 4px;
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(0deg)
    }
    100% {
      transform: rotateZ(360deg)
    }
  }
`;

export default Loading;
