import styled from 'styled-components';

const Form = styled.div`
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;

export default Form;
