import styled from 'styled-components';
import Color from '../../../utils/colors.constants';

const Container = styled.div`
    color: ${Color.AZUL};
    font-size: 1.3em;
    border: 3px solid ${Color.AZUL};
    border-radius: 10px;
    opacity: 1;
    overflow: hidden;
    display: flex;
    width: 80%;
    padding-left: 5%;
    padding-right: 5%;
    padding-bottom:2%;
    min-height: 210px;
    height:auto;
    margin-bottom: 50px;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    font-family : Roboto, sans-serif;
    @media screen and (max-width:1000px){
        flex-direction:column;
        width:85vw;
        height:auto;

    }
    @media screen and (min-width:499px) and (max-width:1000px){
        height:auto;
        padding-bottom:10px;

    }
}
}
`;

export default Container;
