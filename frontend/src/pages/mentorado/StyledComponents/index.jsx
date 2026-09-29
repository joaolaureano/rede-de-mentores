import styled from 'styled-components';


import TituloPage from './TituloPage';

const Container = styled.div`
    max-width: 1280px;
    padding: 10px 15px;
    margin-right: auto;
    margin-left: auto;
    font-family: Roboto, sans-serif;
    color: #00273F;
    
    
    @media (min-width: 576px) {
        max-width: 540px;
    }
    
    @media (min-width: 768px) {
        max-width: 720px;
    }
`;

Container.TituloPage = TituloPage;

export default Container;
