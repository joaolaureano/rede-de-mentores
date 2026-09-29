import styled from 'styled-components';

import Form from './Form';
import Title from './Title';
import Options from './Options';
import Submit from './Submit';
import SecondOption from './SecondOptions';

const Container = styled.div`
  width: 100%;
`;

Container.Form = Form;
Container.Title = Title;
Container.Options = Options;
Container.SecondOption = SecondOption;
Container.Submit = Submit;

export default Container;
