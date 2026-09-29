import React from 'react';
import { string } from 'prop-types';
import TextField from './StyledComponents';

const RedeFormLabel = ({ descricao }) => (
  <TextField>
    <TextField.Label>{descricao}</TextField.Label>
  </TextField>
);

RedeFormLabel.propTypes = {
  descricao: string,
};

RedeFormLabel.defaultProps = {
  descricao: '',
};

export default RedeFormLabel;
