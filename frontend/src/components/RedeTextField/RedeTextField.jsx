import React from 'react';
import { string, func, bool, object, objectOf, any } from 'prop-types';
import TextField from './StyledComponents';

const RedeTextField = ({
  descricao,
  tipo,
  valor,
  onChange,
  erro,
  msgAjuda,
  disabled,
  inputProps,
}) => (
  <TextField erro={erro}>
    <TextField.Label>{descricao}</TextField.Label>
    <TextField.Input type={tipo} value={valor} onChange={onChange} disabled={disabled} {...inputProps} />
    <TextField.MsgAjuda>{msgAjuda}</TextField.MsgAjuda>
  </TextField>
);

RedeTextField.propTypes = {
  descricao: string,
  tipo: string,
  valor: string,
  erro: bool,
  msgAjuda: string,
  onChange: func,
  inputProps: objectOf(any),
};

RedeTextField.defaultProps = {
  descricao: '',
  tipo: '',
  valor: '',
  erro: false,
  msgAjuda: '',
  onChange: () => { },
  inputProps: {},
};

export default RedeTextField;
