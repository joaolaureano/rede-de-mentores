import styled from 'styled-components';

const Title = styled.div`
    display:flex;
    align-self:flex-end;
    button + button{
        margin-left: 20px;
        
    }
    button{
        padding: 7px 12px;
        :hover{
            cursor:initial;
        }
        
    }
`;

export default Title;