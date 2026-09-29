import React from 'react';
import { number, bool } from 'prop-types';
import Container from './StyledComponents';

const RedeHorizontalSeparator = ({ size, isRegister }) => (
  <Container isRegister={isRegister}>
    <Container.Separator size={size} />
  </Container>
);

RedeHorizontalSeparator.propTypes = {
  size: number,
  isRegister: bool,
};

RedeHorizontalSeparator.defaultProps = {
  size: 400,
  isRegister: false,
};

export default RedeHorizontalSeparator;
