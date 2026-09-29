import React from 'react';
import { string, func, number } from 'prop-types';
import TextField from './StyledComponents';

const RedeTextArea = ({
  descricao, valor, onChange, rows,
}) => (
  <TextField>
    <TextField.Label>{descricao}</TextField.Label>
    <TextField.Input value={valor} onChange={onChange} rows={rows} />
  </TextField>
);

RedeTextArea.propTypes = {
  rows: number,
  onChange: func,
  descricao: string,
  valor: string.isRequired,
};

RedeTextArea.defaultProps = {
  rows: 4,
  descricao: '',
  onChange: () => {},
};

export default RedeTextArea;
