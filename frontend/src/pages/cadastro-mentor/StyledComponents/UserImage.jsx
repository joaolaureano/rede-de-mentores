import styled from 'styled-components';
import COLOR from '../../../utils/colors.constants';

const UserImage = styled.img`
    margin-top: 2%;
/*    margin-left: 5%; */
    border: 2px solid ${COLOR.AZUL};
    border-radius: 100%;
    width: 120px;
    height: 120px;
    box-sizing: border-box;
`;

export default UserImage;
