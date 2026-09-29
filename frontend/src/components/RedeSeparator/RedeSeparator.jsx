import React from 'react';
import { string } from 'prop-types';
import Container from './StyledComponents';

const RedeSeparator = ({ descricao }) => (
  <Container>
    <Container.Separator />
    <Container.Title>{descricao}</Container.Title>
    <Container.Separator />
  </Container>
);

RedeSeparator.propTypes = {
  descricao: string,
};

RedeSeparator.defaultProps = {
  descricao: '',
};

export default RedeSeparator;
