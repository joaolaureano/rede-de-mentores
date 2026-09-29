import styled from 'styled-components';
import COLOR from '../../../utils/colors.constants';

const TituloPage = styled.h2`
    font-weight: bold;
    padding: 10px 15px;
    margin-left: 250px;
    color: ${COLOR.AZUL};

    @media only screen and (max-width: 768px) {
        margin-left: 0px;
    }
`;

export default TituloPage;
