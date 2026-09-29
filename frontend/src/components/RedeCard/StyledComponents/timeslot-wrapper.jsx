import styled from 'styled-components';

const TimeSlotWrapper = styled.div`
    display:flex;
    width:35%;

    > button {
        margin-left: 5px;
    }

    @media screen and (max-width:1000px){
        width:100%;
        justify-content:space-around;
        margin-bottom: 10px;
        align-items:center;
        

`;

export default TimeSlotWrapper;
