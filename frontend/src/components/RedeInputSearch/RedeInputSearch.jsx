import React from 'react';
import { string, func } from 'prop-types';
import Container from './StyledComponents';
import Input from './StyledComponents/Input';

const RedeInputSearch = ({ placeholder, onChange }) => (
  <Container>
    <Input type="text" placeholder={placeholder} onChange={onChange} />
  </Container>
);

RedeInputSearch.propTypes = {
  placeholder: string,
  onChange: func,
};

RedeInputSearch.defaultProps = {
  placeholder: '',
  onChange: () => {},
};

export default RedeInputSearch;
